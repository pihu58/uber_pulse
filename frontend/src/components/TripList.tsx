import { Trip } from "@/lib/types";
import { StressBadge } from "./StressBadge";
import { motion } from "framer-motion";
import { Clock, MapPin, DollarSign, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TripListProps {
  trips: Trip[];
}

export function TripList({ trips }: TripListProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-2">
      {trips.map((trip, i) => (
        <motion.div
          key={trip.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => navigate(`/trip/${trip.id}`)}
          className="glass-card p-4 cursor-pointer hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-sm font-medium truncate">{trip.route}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {trip.duration} min
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  ${trip.fare.toFixed(2)}
                </span>
                <span>{trip.distance} km</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StressBadge level={trip.stressLevel} score={trip.stressScore} />
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
