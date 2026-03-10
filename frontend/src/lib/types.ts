export interface Trip {
  id: string;
  driverId: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  fare: number;
  distance: number; // km
  stressLevel: "low" | "medium" | "high";
  stressScore: number; // 0-100
  route: string;
  harshBraking: number;
  harshAcceleration: number;
  audioSpikes: number;
}

export interface StressEvent {
  id: string;
  tripId: string;
  timestamp: string;
  type: "harsh_braking" | "harsh_acceleration" | "audio_spike" | "combined";
  severity: "low" | "medium" | "high";
  description: string;
  duration: number; // seconds
}

export interface EarningsData {
  date: string;
  earnings: number;
  trips: number;
  hours: number;
  earningsPerHour: number;
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  totalTrips: number;
  joinedDate: string;
  avatar?: string;
  dailyGoal: number;
}

export interface EarningsGoal {
  daily: number;
  current: number;
  projectedEnd: number;
  onTrack: boolean;
  hoursRemaining: number;
}
