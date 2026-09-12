import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useAgents } from "@/hooks/useAgents";
import { useReputation } from "@/hooks/useReputation";
import { StatusBadge } from "@/components/StatusBadge";
import { AgentTypeBadge } from "@/components/AgentTypeBadge";
import { SigilScoreInline } from "@/components/SigilScore";
import { RegisterAgentDialog } from "@/components/RegisterAgentDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Search } from "lucide-react";

const Agents = () => {
  const navigate = useNavigate();
  const { data: agents, isLoading } = useAgents();
  const { data: reputation } = useReputation();
  const [search, setSearch] = useState("");

  const scoreMap = useMemo(() => {
    const map = new Map<string, number>();
    reputation?.forEach((r) => map.set(r.agent_id, r.sigil_score));
    return map;
  }, [reputation]);

  const filtered = useMemo(() => {
    if (!agents) return [];
    const q = search.toLowerCase();
    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.agent_code.toLowerCase().includes(q) ||
        a.principal_org.toLowerCase().includes(q)
    );
  }, [agents, search]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Agents</h1>
          <RegisterAgentDialog />
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="rounded-lg border border-border/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Principal Org</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Sigil Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">Loading...</TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">No agents found</TableCell>
                </TableRow>
              ) : (
                filtered.map((agent) => (
                  <TableRow key={agent.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/agents/${agent.id}`)}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{agent.agent_code}</TableCell>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>{agent.principal_org}</TableCell>
                    <TableCell><AgentTypeBadge type={agent.agent_type} /></TableCell>
                    <TableCell>
                      <SigilScoreInline score={scoreMap.get(agent.id) ?? 0} />
                    </TableCell>
                    <TableCell><StatusBadge status={agent.status} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(agent.created_at), "MMM d, yyyy")}
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

export default Agents;
