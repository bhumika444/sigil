import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const body = await req.json();
    const { action } = body;

    if (action === "insert_agent") {
      const { agent, credential, reputation } = body;

      // Insert agent
      const { data: agentData, error: agentError } = await supabase
        .from("agents")
        .insert(agent)
        .select()
        .single();
      if (agentError) throw new Error(`Agent insert failed: ${agentError.message}`);

      // Insert credential — DB uses per_txn_limit (Lovable migration), not spend_per_transaction
      let credentialData = null;
      if (credential) {
        const { spend_per_transaction, per_txn_limit, ...rest } = credential;
        const limit =
          per_txn_limit !== undefined
            ? per_txn_limit
            : spend_per_transaction !== undefined
              ? spend_per_transaction
              : 1000;
        const credInsert = {
          ...rest,
          agent_id: agentData.id,
          per_txn_limit: limit,
        };
        const { data, error } = await supabase
          .from("credentials")
          .insert(credInsert)
          .select()
          .single();
        if (error) throw new Error(`Credential insert failed: ${error.message}`);
        credentialData = data;
      }

      // Insert reputation — only columns that exist on Lovable DB (see supabase/migrations):
      // sigil_score, total_transactions, flagged_transactions — NOT score / anomaly_count / successful_transactions
      let reputationData = null;
      if (reputation) {
        const sigil_score = Number(
          reputation.sigil_score ?? reputation.score ?? 50,
        );
        const total_transactions = Number(reputation.total_transactions ?? 0);
        const flagged_transactions = Number(
          reputation.flagged_transactions ?? reputation.anomaly_count ?? 0,
        );
        const { data, error } = await supabase
          .from("reputation")
          .insert({
            agent_id: agentData.id,
            sigil_score,
            total_transactions,
            flagged_transactions,
          })
          .select()
          .single();
        if (error) throw new Error(`Reputation insert failed: ${error.message}`);
        reputationData = data;
      }

      return new Response(
        JSON.stringify({
          agent: agentData,
          credential: credentialData,
          sigil_score: reputationData,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    if (action === "get_agent") {
      const agent_code = body.agent_code as string | undefined;
      if (!agent_code) {
        throw new Error("get_agent requires agent_code");
      }
      const { data: agent, error: agentErr } = await supabase
        .from("agents")
        .select("*")
        .eq("agent_code", agent_code)
        .maybeSingle();
      if (agentErr) throw new Error(`get_agent agent: ${agentErr.message}`);
      if (!agent) {
        return new Response(
          JSON.stringify({ agent: null, credential: null, reputation: null }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
        );
      }
      const { data: credRows, error: credErr } = await supabase
        .from("credentials")
        .select("*")
        .eq("agent_id", agent.id)
        .eq("status", "active")
        .order("issued_at", { ascending: false })
        .limit(1);
      if (credErr) throw new Error(`get_agent credential: ${credErr.message}`);
      const credential = credRows?.[0] ?? null;

      const { data: reputation, error: repErr } = await supabase
        .from("reputation")
        .select("*")
        .eq("agent_id", agent.id)
        .maybeSingle();
      if (repErr) throw new Error(`get_agent reputation: ${repErr.message}`);

      return new Response(
        JSON.stringify({ agent, credential, reputation }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
      );
    }

    if (action === "settle_transaction") {
      const { transaction: txIn, audit_log: auditIn } = body;
      if (!txIn?.agent_id) {
        throw new Error("settle_transaction requires transaction.agent_id");
      }
      const { data: txRow, error: txErr } = await supabase
        .from("transactions")
        .insert({
          agent_id: txIn.agent_id,
          credential_id: txIn.credential_id ?? null,
          amount: txIn.amount ?? 0,
          currency: txIn.currency ?? "USD",
          counterparty: txIn.counterparty ?? "",
          category: txIn.category ?? "",
          status: txIn.status ?? "settled",
          rejection_reason: null,
        })
        .select()
        .single();
      if (txErr) throw new Error(`Transaction insert failed: ${txErr.message}`);

      const { data: repBefore, error: repFetchErr } = await supabase
        .from("reputation")
        .select("total_transactions")
        .eq("agent_id", txIn.agent_id)
        .single();
      if (repFetchErr) throw new Error(`Reputation fetch failed: ${repFetchErr.message}`);
      const nextTotal = (repBefore?.total_transactions ?? 0) + 1;
      const { error: repUpdErr } = await supabase
        .from("reputation")
        .update({
          total_transactions: nextTotal,
          updated_at: new Date().toISOString(),
        })
        .eq("agent_id", txIn.agent_id);
      if (repUpdErr) throw new Error(`Reputation update failed: ${repUpdErr.message}`);

      let audit_log = null;
      if (auditIn?.agent_id && auditIn?.event_type) {
        const details =
          auditIn.details &&
          typeof auditIn.details === "object" &&
          !Array.isArray(auditIn.details)
            ? auditIn.details
            : {};
        const { data: ad, error: adErr } = await supabase
          .from("audit_logs")
          .insert({
            agent_id: auditIn.agent_id,
            event_type: auditIn.event_type,
            severity: auditIn.severity ?? "info",
            details,
          })
          .select()
          .single();
        if (adErr) throw new Error(`Audit log insert failed: ${adErr.message}`);
        audit_log = ad;
      }

      return new Response(
        JSON.stringify({ transaction: txRow, audit_log }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
      );
    }

    if (action === "reject_transaction") {
      const { transaction: txIn, audit_log: auditIn } = body;
      if (!txIn?.agent_id) {
        throw new Error("reject_transaction requires transaction.agent_id");
      }
      const { data: txRow, error: txErr } = await supabase
        .from("transactions")
        .insert({
          agent_id: txIn.agent_id,
          credential_id: txIn.credential_id ?? null,
          amount: txIn.amount ?? 0,
          currency: txIn.currency ?? "USD",
          counterparty: txIn.counterparty ?? "",
          category: txIn.category ?? "",
          status: "rejected",
          rejection_reason: txIn.rejection_reason ?? null,
        })
        .select()
        .single();
      if (txErr) throw new Error(`Transaction insert failed: ${txErr.message}`);

      const { data: repBefore, error: repFetchErr } = await supabase
        .from("reputation")
        .select("total_transactions, flagged_transactions")
        .eq("agent_id", txIn.agent_id)
        .single();
      if (repFetchErr) throw new Error(`Reputation fetch failed: ${repFetchErr.message}`);
      const nextTotal = (repBefore?.total_transactions ?? 0) + 1;
      const nextFlagged = (repBefore?.flagged_transactions ?? 0) + 1;
      const { error: repUpdErr } = await supabase
        .from("reputation")
        .update({
          total_transactions: nextTotal,
          flagged_transactions: nextFlagged,
          updated_at: new Date().toISOString(),
        })
        .eq("agent_id", txIn.agent_id);
      if (repUpdErr) throw new Error(`Reputation update failed: ${repUpdErr.message}`);

      let audit_log = null;
      if (auditIn?.agent_id && auditIn?.event_type) {
        const details =
          auditIn.details &&
          typeof auditIn.details === "object" &&
          !Array.isArray(auditIn.details)
            ? auditIn.details
            : {};
        const { data: ad, error: adErr } = await supabase
          .from("audit_logs")
          .insert({
            agent_id: auditIn.agent_id,
            event_type: auditIn.event_type,
            severity: auditIn.severity ?? "warning",
            details,
          })
          .select()
          .single();
        if (adErr) throw new Error(`Audit log insert failed: ${adErr.message}`);
        audit_log = ad;
      }

      return new Response(
        JSON.stringify({ transaction: txRow, audit_log }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
      );
    }

    if (action === "insert_audit_log") {
      const { audit_log } = body;
      if (!audit_log?.agent_id || !audit_log?.event_type) {
        throw new Error(
          "insert_audit_log requires audit_log.agent_id and audit_log.event_type",
        );
      }
      const details =
        audit_log.details &&
        typeof audit_log.details === "object" &&
        !Array.isArray(audit_log.details)
          ? audit_log.details
          : {};
      const row = {
        agent_id: audit_log.agent_id,
        event_type: audit_log.event_type,
        severity: audit_log.severity ?? "info",
        details,
      };
      const { data, error } = await supabase
        .from("audit_logs")
        .insert(row)
        .select()
        .single();
      if (error) throw new Error(`Audit log insert failed: ${error.message}`);
      return new Response(
        JSON.stringify({ audit_log: data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    return new Response(
      JSON.stringify({
        error:
          "Unknown action. Supported: insert_agent, insert_audit_log, get_agent, settle_transaction, reject_transaction",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
