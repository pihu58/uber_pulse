import { trips, stressEvents, stressTimeline } from "@/lib/mockData";
import { StressBadge } from "@/components/StressBadge";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";
import { AlertTriangle, Shield, TrendingDown } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";

const StressPage = () => {
  const highStressTrips = trips.filter((t) => t.stressLevel === "high").length;
  const avgStress = Math.round(trips.reduce((s, t) => s + t.stressScore, 0) / trips.length);
  const totalEvents = stressEvents.length;

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="px-4 pt-6 pb-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-2xl font-bold mb-1">Stress Monitor</h1>
          <p className="text-sm text-muted-foreground">Real-time safety & wellbeing signals</p>
        </motion.div>
      </div>

      <div className="px-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <MetricCard title="Avg Score" value={avgStress} icon={TrendingDown} variant={avgStress > 50 ? "danger" : "success"} />
          <MetricCard title="High Trips" value={highStressTrips} icon={AlertTriangle} variant={highStressTrips > 0 ? "warning" : "success"} />
          <MetricCard title="Events" value={totalEvents} icon={Shield} />
        </div>

        {/* Full Stress Timeline */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Today's Stress Timeline</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stressTimeline}>
              <defs>
                <linearGradient id="stressGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                  <stop offset="50%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(153, 96%, 39%)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(0,0%,55%)" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(0,0%,55%)" }} axisLine={false} tickLine={false} />
              <ReferenceLine y={50} stroke="hsl(38,92%,50%)" strokeDasharray="3 3" strokeOpacity={0.5} />
              <ReferenceLine y={70} stroke="hsl(0,72%,51%)" strokeDasharray="3 3" strokeOpacity={0.5} />
              <Tooltip contentStyle={{ background: "hsl(0,0%,11%)", border: "1px solid hsl(0,0%,18%)", borderRadius: "8px", fontSize: "12px", color: "hsl(0,0%,96%)" }} />
              <Area type="monotone" dataKey="score" stroke="hsl(38,92%,50%)" strokeWidth={2} fill="url(#stressGrad2)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-warning inline-block" /> Warning (50)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-destructive inline-block" /> Critical (70)</span>
          </div>
        </div>

        {/* Per-trip stress */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Stress by Trip</h3>
          <div className="space-y-3">
            {trips.map((trip) => (
              <div key={trip.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{trip.route}</p>
                  <p className="text-xs text-muted-foreground">{trip.duration} min</p>
                </div>
                <div className="w-24 h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${trip.stressScore}%`,
                      backgroundColor: trip.stressScore > 60 ? "hsl(0,72%,51%)" : trip.stressScore > 30 ? "hsl(38,92%,50%)" : "hsl(153,96%,39%)",
                    }}
                  />
                </div>
                <StressBadge level={trip.stressLevel} />
              </div>
            ))}
          </div>
        </div>

        {/* All Events */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">All Flagged Moments</h3>
          <div className="space-y-2">
            {stressEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{event.description}</span>
                  <StressBadge level={event.severity} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Trip {event.tripId} · {new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {event.duration}s
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StressPage;
