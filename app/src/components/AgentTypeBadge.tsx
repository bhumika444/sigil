import { cn } from "@/lib/utils";

const typeStyles: Record<string, string> = {
  procurement: "bg-primary/15 text-primary border-primary/30",
  trading: "bg-sigil-amber/15 text-sigil-amber border-sigil-amber/30",
  research: "bg-sigil-green/15 text-sigil-green border-sigil-green/30",
  payment: "bg-sigil-red/15 text-sigil-red border-sigil-red/30",
};

export function AgentTypeBadge({ type }: { type: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
        typeStyles[type] || "bg-muted text-muted-foreground border-border"
      )}
    >
      {type}
    </span>
  );
}
