import { MetricCard } from "@/components/MetricCard";
import { EarningsProgress } from "@/components/EarningsProgress";
import { TripList } from "@/components/TripList";
import { trips, earningsGoal, stressTimeline, driver } from "@/lib/mockData";
import { DollarSign, Route, Activity, Clock, Star } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

const Dashboard = () => {
  const totalEarnings = trips.reduce((s, t) => s + t.fare, 0);
  const avgStress = Math.round(trips.reduce((s, t) => s + t.stressScore, 0) / trips.length);
  const totalTime = trips.reduce((s, t) => s + t.duration, 0);

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Good morning,</p>
            <h1 className="text-2xl font-bold">{driver.name}</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full">
            <Star className="w-3.5 h-3.5 text-warning fill-warning" />
            <span className="text-sm font-semibold">{driver.rating}</span>
          </div>
        </motion.div>

        {/* Earnings Goal */}
        <EarningsProgress
          current={earningsGoal.current}
          goal={earningsGoal.daily}
          projected={earningsGoal.projectedEnd}
          onTrack={earningsGoal.onTrack}
        />
      </div>

      {/* Metrics Grid */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-6">
        <MetricCard
          title="Today's Earnings"
          value={`$${totalEarnings.toFixed(0)}`}
          icon={DollarSign}
          variant="success"
          trend={{ value: 12, positive: true }}
        />
        <MetricCard
          title="Trips"
          value={trips.length}
          subtitle={`${totalTime} min total`}
          icon={Route}
        />
        <MetricCard
          title="Avg Stress"
          value={avgStress}
          subtitle="out of 100"
          icon={Activity}
          variant={avgStress > 50 ? "danger" : avgStress > 30 ? "warning" : "success"}
        />
        <MetricCard
          title="Active Time"
          value={`${(totalTime / 60).toFixed(1)}h`}
          subtitle={`$${(totalEarnings / (totalTime / 60)).toFixed(0)}/hr`}
          icon={Clock}
        />
      </div>

      {/* Stress Timeline Chart */}
      <div className="px-4 mb-6">
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Stress Timeline</h3>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={stressTimeline}>
              <defs>
                <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(153, 96%, 39%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(153, 96%, 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(0, 0%, 55%)" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} hide />
              <Tooltip
                contentStyle={{
                  background: "hsl(0, 0%, 11%)",
                  border: "1px solid hsl(0, 0%, 18%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "hsl(0, 0%, 96%)",
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(153, 96%, 39%)"
                strokeWidth={2}
                fill="url(#stressGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="px-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Trips</h3>
        <TripList trips={trips.slice(0, 5)} />
      </div>
    </div>
  );
};

export default Dashboard;
