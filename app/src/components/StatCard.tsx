import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  accent?: "green" | "purple" | "amber" | "red";
  children?: React.ReactNode;
}

const accentLine: Record<string, string> = {
  green: "bg-sigil-green",
  purple: "bg-primary",
  amber: "bg-sigil-amber",
  red: "bg-sigil-red",
};

export function StatCard({ title, value, subtitle, accent = "purple", children }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden border-border/50">
      <div className={cn("absolute left-0 top-0 h-full w-1", accentLine[accent])} />
      <CardContent className="p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
        <div className="mt-2 flex items-end gap-3">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          {children}
        </div>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
