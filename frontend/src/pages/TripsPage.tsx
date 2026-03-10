import { trips } from "@/lib/mockData";
import { TripList } from "@/components/TripList";
import { motion } from "framer-motion";

const TripsPage = () => {
  const totalFare = trips.reduce((s, t) => s + t.fare, 0);
  const totalDist = trips.reduce((s, t) => s + t.distance, 0);

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="px-4 pt-6 pb-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-2xl font-bold mb-1">All Trips</h1>
          <p className="text-sm text-muted-foreground">
            {trips.length} trips · ${totalFare.toFixed(0)} earned · {totalDist.toFixed(0)} km
          </p>
        </motion.div>
      </div>
      <div className="px-4">
        <TripList trips={trips} />
      </div>
    </div>
  );
};

export default TripsPage;
