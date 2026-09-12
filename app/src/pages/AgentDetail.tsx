import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useAgent, useAgentCredentials, useAgentReputation, useAgentTransactions, useAgentAuditLogs } from "@/hooks/useAgentDetail";
import { StatusBadge } from "@/components/StatusBadge";
import { AgentTypeBadge } from "@/components/AgentTypeBadge";
import { SigilScore } from "@/components/SigilScore";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ArrowLeft, Shield, Ban } from "lucide-react";

function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

const AgentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: agent, isLoading: agentLoading } = useAgent(id!);
  const { data: credentials } = useAgentCredentials(id!);
  const { data: reputation } = useAgentReputation(id!);
  const { data: transactions } = useAgentTransactions(id!);
  const { data: auditLogs } = useAgentAuditLogs(id!);

  const credential = credentials?.[0];
  const scope = (credential?.scope as Record<string, unknown>) ?? {};
  const categories = (scope.categories as string[]) ?? [];
  const counterparties = (scope.counterparties as string[]) ?? [];
  const geographies = (scope.geographies as string[]) ?? [];

  if (agentLoading) {
    return <Layout><div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div></Layout>;
  }

  if (!agent) {
    return <Layout><div className="flex items-center justify-center h-64 text-muted-foreground">Agent not found</div></Layout>;
  }

  const totalTxns = reputation?.total_transactions ?? 0;
  const flagged = reputation?.flagged_transactions ?? 0;
  const successful = totalTxns - flagged;
  const score = reputation?.sigil_score ?? 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back button */}
        <Button variant="ghost" size="sm" onClick={() => navigate("/agents")} className="gap-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Agents
        </Button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-mono text-2xl font-bold tracking-tight">{agent.agent_code}</h1>
            <StatusBadge status={agent.status} />
            <AgentTypeBadge type={agent.agent_type} />
          </div>
          <p className="text-lg font-medium">{agent.name}</p>
          {agent.description && <p className="text-sm text-muted-foreground">{agent.description}</p>}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sigil Passport Card */}
          <Card className="lg:col-span-2 border-primary/30 bg-card">
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Sigil Passport</CardTitle>
              </div>
              <Button variant="outline" size="sm" className="border-destructive/50 text-destructive hover:bg-destructive/10 gap-1" disabled>
                <Ban className="h-3.5 w-3.5" /> Revoke Sigil
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Principal</p>
                <p className="text-sm font-medium">{agent.principal_org} / {agent.principal_user}</p>
              </div>

              {categories.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Permitted Categories</p>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((c) => (
                      <span key={c} className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs text-primary">{c}</span>
                    ))}
                  </div>
                </div>
              )}

              {counterparties.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Permitted Counterparties</p>
                  <p className="text-sm">{counterparties.join(", ")}</p>
                </div>
              )}

              {geographies.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Permitted Geographies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {geographies.map((g) => (
                      <span key={g} className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs text-primary">{g}</span>
                    ))}
                  </div>
                </div>
              )}

              {credential && (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Spend Limit</p>
                    <p className="text-sm font-medium">
                      {formatCurrency(Number(credential.spend_limit ?? 0))} total / {formatCurrency(Number(credential.per_txn_limit ?? 0))} per txn
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Issued</p>
                      <p className="text-sm">{format(new Date(credential.issued_at), "MMM d, yyyy")}</p>
                    </div>
                    {credential.expires_at && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Expires</p>
                        <p className="text-sm">{format(new Date(credential.expires_at), "MMM d, yyyy")}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Status</p>
                      <StatusBadge status={credential.status} />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Sigil Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sigil Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <SigilScore score={score} size={100} />
              <div className="grid grid-cols-3 gap-4 w-full text-center">
                <div>
                  <p className="text-xl font-bold">{totalTxns}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-sigil-green">{successful}</p>
                  <p className="text-xs text-muted-foreground">Successful</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-sigil-red">{flagged}</p>
                  <p className="text-xs text-muted-foreground">Anomalies</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Counterparty</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!transactions?.length ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No transactions</TableCell></TableRow>
                ) : transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">{formatCurrency(Number(tx.amount), tx.currency)}</TableCell>
                    <TableCell>{tx.counterparty ?? "—"}</TableCell>
                    <TableCell className="capitalize">{tx.category ?? "—"}</TableCell>
                    <TableCell><StatusBadge status={tx.status} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{format(new Date(tx.created_at), "MMM d, HH:mm")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Audit Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Audit Log</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!auditLogs?.length ? (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No audit logs</TableCell></TableRow>
                ) : auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">{log.event_type}</TableCell>
                    <TableCell><SeverityBadge severity={log.severity} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{format(new Date(log.created_at), "MMM d, HH:mm")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AgentDetail;
