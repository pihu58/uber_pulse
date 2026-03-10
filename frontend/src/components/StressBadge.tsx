import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StressBadgeProps {
  level: "low" | "medium" | "high";
  score?: number;
  size?: "sm" | "md";
}

const levelConfig = {
  low: { label: "Low", bg: "bg-primary/15", text: "text-primary", dot: "bg-primary" },
  medium: { label: "Medium", bg: "bg-warning/15", text: "text-warning", dot: "bg-warning" },
  high: { label: "High", bg: "bg-destructive/15", text: "text-destructive", dot: "bg-destructive" },
};

export function StressBadge({ level, score, size = "sm" }: StressBadgeProps) {
  const config = levelConfig[level];
  return (
    <motion.span
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        config.bg, config.text,
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {config.label}
      {score !== undefined && <span className="opacity-70">({score})</span>}
    </motion.span>
  );
}
