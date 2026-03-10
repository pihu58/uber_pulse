import { useParams, useNavigate } from "react-router-dom";
import { trips, stressEvents } from "@/lib/mockData";
import { StressBadge } from "@/components/StressBadge";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, DollarSign, MapPin, Gauge, Volume2, AlertTriangle } from "lucide-react";

const eventIcons = {
  harsh_braking: AlertTriangle,
  harsh_acceleration: Gauge,
  audio_spike: Volume2,
  combined: AlertTriangle,
};

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const trip = trips.find((t) => t.id === id);
  const events = stressEvents.filter((e) => e.tripId === id);

  if (!trip) return <div className="p-6 text-muted-foreground">Trip not found</div>;

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="px-4 pt-6 pb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">{trip.route}</h1>
            <StressBadge level={trip.stressLevel} score={trip.stressScore} size="md" />
          </div>

          {/* Trip Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: DollarSign, label: "Fare", value: `$${trip.fare.toFixed(2)}` },
              { icon: Clock, label: "Duration", value: `${trip.duration} min` },
              { icon: MapPin, label: "Distance", value: `${trip.distance} km` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="glass-card p-3 text-center">
                <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-bold">{value}</p>
              </div>
            ))}
          </div>

          {/* Safety Metrics */}
          <div className="glass-card p-4 mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Safety Signals</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-destructive">{trip.harshBraking}</p>
                <p className="text-xs text-muted-foreground">Harsh Braking</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{trip.harshAcceleration}</p>
                <p className="text-xs text-muted-foreground">Hard Accel.</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-chart-purple">{trip.audioSpikes}</p>
                <p className="text-xs text-muted-foreground">Audio Spikes</p>
              </div>
            </div>
          </div>

          {/* Stress Events */}
          {events.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Flagged Moments</h3>
              <div className="space-y-2">
                {events.map((event, i) => {
                  const EventIcon = eventIcons[event.type];
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="glass-card p-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-secondary">
                          <EventIcon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-sm font-medium">{event.description}</span>
                            <StressBadge level={event.severity} />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {event.duration}s
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TripDetail;
