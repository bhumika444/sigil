import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  active: "bg-sigil-green/15 text-sigil-green border-sigil-green/30",
  settled: "bg-sigil-green/15 text-sigil-green border-sigil-green/30",
  verified: "bg-sigil-green/15 text-sigil-green border-sigil-green/30",
  suspended: "bg-sigil-amber/15 text-sigil-amber border-sigil-amber/30",
  flagged: "bg-sigil-amber/15 text-sigil-amber border-sigil-amber/30",
  expired: "bg-sigil-amber/15 text-sigil-amber border-sigil-amber/30",
  pending: "bg-primary/15 text-primary border-primary/30",
  revoked: "bg-sigil-red/15 text-sigil-red border-sigil-red/30",
  rejected: "bg-sigil-red/15 text-sigil-red border-sigil-red/30",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
        statusStyles[status] || "bg-muted text-muted-foreground border-border"
      )}
    >
      {status}
    </span>
  );
}
