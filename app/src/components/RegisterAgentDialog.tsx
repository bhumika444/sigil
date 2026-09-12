import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "office-supplies", "software-licenses", "cloud-infrastructure", "travel",
  "marketing", "consulting", "raw-materials", "logistics",
];

const GEOGRAPHIES = ["US", "EU", "UK", "APAC", "Global"];

function ChipSelect({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              active
                ? "border-primary bg-primary/20 text-primary"
                : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50"
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function RegisterAgentDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [principalOrg, setPrincipalOrg] = useState("");
  const [principalUser, setPrincipalUser] = useState("");
  const [agentType, setAgentType] = useState("procurement");
  const [permittedCategories, setPermittedCategories] = useState<string[]>([]);
  const [counterparties, setCounterparties] = useState("");
  const [permittedGeographies, setPermittedGeographies] = useState<string[]>([]);
  const [spendLimit, setSpendLimit] = useState(10000);
  const [spendPerTransaction, setSpendPerTransaction] = useState(1000);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const toggleChip = (list: string[], item: string) =>
    list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

  const resetForm = () => {
    setName(""); setDescription(""); setPrincipalOrg(""); setPrincipalUser("");
    setAgentType("procurement"); setPermittedCategories([]); setCounterparties("");
    setPermittedGeographies([]); setSpendLimit(10000); setSpendPerTransaction(1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = {
        name,
        description,
        principal_org: principalOrg,
        principal_user: principalUser,
        agent_type: agentType,
        permitted_categories: permittedCategories,
        permitted_counterparties: counterparties.split(",").map((s) => s.trim()).filter(Boolean),
        permitted_geographies: permittedGeographies,
        spend_limit: spendLimit,
        spend_per_transaction: spendPerTransaction,
      };
      const webhookUrl = import.meta.env.VITE_N8N_ISSUE_CREDENTIAL_URL || "https://vgunda.app.n8n.cloud/webhook/issue-credential";
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Webhook failed");
      const data = await res.json();
      toast.success(`Sigil Passport issued to ${data.agent?.agent_code ?? name}`);
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      setOpen(false);
      resetForm();
    } catch {
      toast.error("Failed to register agent.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Register Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Register New Agent</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="org">Principal Organization</Label>
            <Input id="org" value={principalOrg} onChange={(e) => setPrincipalOrg(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user">Principal User</Label>
            <Input id="user" value={principalUser} onChange={(e) => setPrincipalUser(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Agent Type</Label>
            <Select value={agentType} onValueChange={setAgentType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="procurement">Procurement</SelectItem>
                <SelectItem value="trading">Trading</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Permitted Categories</Label>
            <ChipSelect
              options={CATEGORIES}
              selected={permittedCategories}
              onToggle={(v) => setPermittedCategories((prev) => toggleChip(prev, v))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="counterparties">Permitted Counterparties</Label>
            <Input
              id="counterparties"
              placeholder="Comma-separated names"
              value={counterparties}
              onChange={(e) => setCounterparties(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Permitted Geographies</Label>
            <ChipSelect
              options={GEOGRAPHIES}
              selected={permittedGeographies}
              onToggle={(v) => setPermittedGeographies((prev) => toggleChip(prev, v))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="spend-limit">Spend Limit (USD)</Label>
              <Input id="spend-limit" type="number" value={spendLimit} onChange={(e) => setSpendLimit(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="per-txn">Per Transaction (USD)</Label>
              <Input id="per-txn" type="number" value={spendPerTransaction} onChange={(e) => setSpendPerTransaction(Number(e.target.value))} />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Issuing Sigil Passport..." : "Register Agent"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
