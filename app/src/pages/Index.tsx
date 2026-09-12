import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { SigilScore } from "@/components/SigilScore";
import { StatusBadge } from "@/components/StatusBadge";
import { SeverityBadge } from "@/components/SeverityBadge";
import { useAgents } from "@/hooks/useAgents";
import { useCredentials } from "@/hooks/useCredentials";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { useReputation } from "@/hooks/useReputation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

function formatCurrency(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

const Dashboard = () => {
  const { data: agents } = useAgents();
  const { data: credentials } = useCredentials();
  const { data: transactions } = useTransactions(10);
  const { data: auditLogs } = useAuditLogs();
  const { data: reputation } = useReputation();

  const activeAgents = agents?.filter((a) => a.status === "active").length ?? 0;
  const activeCredentials = credentials?.filter((c) => c.status === "active").length ?? 0;

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentTxns = transactions?.filter((t) => new Date(t.created_at) >= thirtyDaysAgo) ?? [];
  const totalAmount = recentTxns.reduce((sum, t) => sum + Number(t.amount), 0);

  const avgScore = reputation?.length
    ? Math.round(reputation.reduce((sum, r) => sum + r.sigil_score, 0) / reputation.length)
    : 0;

  const alerts = auditLogs?.filter((l) => l.severity === "warning" || l.severity === "critical").slice(0, 8) ?? [];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Active Agents" value={activeAgents} accent="green" />
          <StatCard title="Credentials Issued" value={activeCredentials} accent="purple" />
          <StatCard title="Transactions (30d)" value={recentTxns.length} subtitle={formatCurrency(totalAmount)} accent="purple" />
          <StatCard title="Avg Sigil Score" value={`${avgScore}/100`} accent="purple">
            <SigilScore score={avgScore} size={36} />
          </StatCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Counterparty</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions?.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium">{tx.agents?.name ?? "—"}</TableCell>
                      <TableCell className="tabular-nums">{formatCurrency(tx.amount, tx.currency)}</TableCell>
                      <TableCell>{tx.counterparty}</TableCell>
                      <TableCell className="capitalize">{tx.category?.replace(/_/g, " ")}</TableCell>
                      <TableCell><StatusBadge status={tx.status} /></TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((log) => {
                const details = log.details as Record<string, string> | null;
                return (
                  <div key={log.id} className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
                    <SeverityBadge severity={log.severity} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground">{log.agents?.name ?? "System"}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {details?.reason || details?.details || log.event_type}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
