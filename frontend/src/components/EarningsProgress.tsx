import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface EarningsProgressProps {
  current: number;
  goal: number;
  projected: number;
  onTrack: boolean;
}

export function EarningsProgress({ current, goal, projected, onTrack }: EarningsProgressProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  const projectedPercentage = Math.min((projected / goal) * 100, 100);

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Daily Goal</h3>
        <span className={cn(
          "text-xs font-medium px-2.5 py-1 rounded-full",
          onTrack ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
        )}>
          {onTrack ? "On Track" : "Behind"}
        </span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold">${current.toFixed(0)}</span>
        <span className="text-muted-foreground text-sm">/ ${goal}</span>
      </div>

      <div className="space-y-2">
        <div className="h-3 rounded-full bg-secondary overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
          />
          {/* Projected marker */}
          <div
            className="absolute top-0 h-full w-0.5 bg-foreground/30"
            style={{ left: `${projectedPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{percentage.toFixed(0)}% earned</span>
          <span>Projected: ${projected}</span>
        </div>
      </div>
    </div>
  );
}
