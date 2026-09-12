import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { useCredentials } from "@/hooks/useCredentials";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Search } from "lucide-react";

function formatCurrency(amount: number | null) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

function scopeSummary(scope: unknown): string {
  if (!scope || typeof scope !== "object") return "—";
  const s = scope as Record<string, unknown>;
  const actions = Array.isArray(s.actions) ? s.actions.join(", ") : "";
  const markets = Array.isArray(s.markets) ? s.markets.join(", ") : "";
  return [actions, markets].filter(Boolean).join(" · ") || "—";
}

const Credentials = () => {
  const { data: credentials, isLoading } = useCredentials();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!credentials) return [];
    const q = search.toLowerCase();
    return credentials.filter(
      (c) =>
        c.agents?.name?.toLowerCase().includes(q) ||
        scopeSummary(c.scope).toLowerCase().includes(q)
    );
  }, [credentials, search]);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Credentials</h1>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search credentials..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="rounded-lg border border-border/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Spend Limit</TableHead>
                <TableHead>Per-Txn Limit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Expires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No credentials found</TableCell></TableRow>
              ) : (
                filtered.map((cred) => (
                  <TableRow key={cred.id}>
                    <TableCell className="font-medium">{cred.agents?.name ?? "—"}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">{scopeSummary(cred.scope)}</TableCell>
                    <TableCell className="tabular-nums">{formatCurrency(cred.spend_limit)}</TableCell>
                    <TableCell className="tabular-nums">{formatCurrency(cred.per_txn_limit)}</TableCell>
                    <TableCell><StatusBadge status={cred.status} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{format(new Date(cred.issued_at), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{cred.expires_at ? format(new Date(cred.expires_at), "MMM d, yyyy") : "—"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default Credentials;
