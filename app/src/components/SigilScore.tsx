import { cn } from "@/lib/utils";

function scoreColor(score: number) {
  if (score >= 80) return "text-sigil-green";
  if (score >= 50) return "text-sigil-amber";
  return "text-sigil-red";
}

function strokeColor(score: number) {
  if (score >= 80) return "stroke-sigil-green";
  if (score >= 50) return "stroke-sigil-amber";
  return "stroke-sigil-red";
}

export function SigilScore({ score, size = 40 }: { score: number; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={3} className="stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className={cn(strokeColor(score), "transition-all duration-500")}
        />
      </svg>
      <span className={cn("absolute text-xs font-bold", scoreColor(score))}>{score}</span>
    </div>
  );
}

export function SigilScoreInline({ score }: { score: number }) {
  return <span className={cn("font-semibold tabular-nums", scoreColor(score))}>{score}</span>;
}
