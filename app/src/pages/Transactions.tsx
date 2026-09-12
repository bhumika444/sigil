import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { useTransactions } from "@/hooks/useTransactions";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { Search, AlertCircle } from "lucide-react";

function formatCurrency(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

const Transactions = () => {
  const { data: transactions, isLoading } = useTransactions();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!transactions) return [];
    const q = search.toLowerCase();
    return transactions.filter(
      (t) =>
        t.agents?.name?.toLowerCase().includes(q) ||
        t.agents?.agent_code?.toLowerCase().includes(q) ||
        t.counterparty?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
    );
  }, [transactions, search]);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Transactions</h1>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="rounded-lg border border-border/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Counterparty</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rejection</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No transactions found</TableCell></TableRow>
              ) : (
                filtered.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{tx.agents?.name ?? "—"}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{tx.agents?.agent_code}</p>
                      </div>
                    </TableCell>
                    <TableCell className="tabular-nums font-medium">{formatCurrency(tx.amount, tx.currency)}</TableCell>
                    <TableCell>{tx.counterparty}</TableCell>
                    <TableCell className="capitalize text-sm">{tx.category?.replace(/_/g, " ")}</TableCell>
                    <TableCell><StatusBadge status={tx.status} /></TableCell>
                    <TableCell>
                      {tx.rejection_reason ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertCircle className="h-4 w-4 text-sigil-red" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">{tx.rejection_reason}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(tx.created_at), "MMM d, HH:mm")}
                    </TableCell>
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

export default Transactions;
