import { weeklyEarnings, hourlyEarnings, earningsGoal } from "@/lib/mockData";
import { EarningsProgress } from "@/components/EarningsProgress";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";

const EarningsPage = () => {
  const totalWeek = weeklyEarnings.reduce((s, d) => s + d.earnings, 0);
  const avgPerHour = (weeklyEarnings.reduce((s, d) => s + d.earningsPerHour, 0) / weeklyEarnings.length).toFixed(2);

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="px-4 pt-6 pb-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-2xl font-bold mb-1">Earnings</h1>
          <p className="text-sm text-muted-foreground">Weekly: ${totalWeek} · Avg: ${avgPerHour}/hr</p>
        </motion.div>
      </div>

      <div className="px-4 space-y-4">
        <EarningsProgress
          current={earningsGoal.current}
          goal={earningsGoal.daily}
          projected={earningsGoal.projectedEnd}
          onTrack={earningsGoal.onTrack}
        />

        {/* Cumulative Earnings Today */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Today's Velocity</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={hourlyEarnings}>
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(0,0%,55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(0,0%,55%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(0,0%,11%)", border: "1px solid hsl(0,0%,18%)", borderRadius: "8px", fontSize: "12px", color: "hsl(0,0%,96%)" }} />
              <Line type="monotone" dataKey="cumulative" stroke="hsl(153,96%,39%)" strokeWidth={2.5} dot={false} />
              {/* Goal line */}
              <Line type="monotone" dataKey={() => earningsGoal.daily} stroke="hsl(0,0%,40%)" strokeDasharray="4 4" strokeWidth={1} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Bar Chart */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">This Week</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyEarnings}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(0,0%,55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(0,0%,55%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(0,0%,11%)", border: "1px solid hsl(0,0%,18%)", borderRadius: "8px", fontSize: "12px", color: "hsl(0,0%,96%)" }} />
              <Bar dataKey="earnings" fill="hsl(153,96%,39%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Breakdown */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Daily Breakdown</h3>
          <div className="space-y-2">
            {weeklyEarnings.map((day) => (
              <div key={day.date} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <span className="text-sm font-medium">{day.date}</span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">{day.trips} trips</span>
                  <span className="text-muted-foreground">{day.hours}h</span>
                  <span className="font-semibold">${day.earnings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
