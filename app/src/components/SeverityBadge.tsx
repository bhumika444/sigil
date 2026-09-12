import { cn } from "@/lib/utils";

const severityStyles: Record<string, string> = {
  info: "bg-primary/15 text-primary border-primary/30",
  warning: "bg-sigil-amber/15 text-sigil-amber border-sigil-amber/30",
  critical: "bg-sigil-red/15 text-sigil-red border-sigil-red/30",
};

export function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
        severityStyles[severity] || "bg-muted text-muted-foreground border-border"
      )}
    >
      {severity}
    </span>
  );
}
