export type TrainingSport = "run" | "bike" | "swim" | "strength" | "recovery";

export interface TrainingWorkout {
  id: string;
  workoutDate: string;
  title: string;
  sport: TrainingSport;
  durationMinutes: number;
  distanceKm?: number;
  completed: boolean;
  source: "plan" | "manual" | "strava" | "runna";
  notes?: string;
  externalUrl?: string;
}

export interface StrengthEntry {
  id: string;
  performedOn: string;
  exercise: string;
  weightKg: number;
  reps: number;
  sets: number;
}

export interface RaceGoal {
  name: string;
  date: string;
  type: string;
  accent: string;
}

export const raceGoals: RaceGoal[] = [
  {
    name: "Santa Cruz Half Marathon",
    date: "2026-10-26",
    type: "Half marathon · 13.1 miles",
    accent: "#b9853f",
  },
  {
    name: "San Francisco Marathon",
    date: "2027-07-25",
    type: "Marathon · 26.2 miles",
    accent: "#d46a4c",
  },
  {
    name: "Santa Cruz 70.3",
    date: "2027-09-12",
    type: "Half Ironman · 70.3 miles",
    accent: "#397f88",
  },
];

export const seedWorkouts: TrainingWorkout[] = [
  {
    id: "seed-1",
    workoutDate: "2026-07-27",
    title: "Easy aerobic run",
    sport: "run",
    durationMinutes: 45,
    distanceKm: 7,
    completed: false,
    source: "plan",
  },
  {
    id: "seed-2",
    workoutDate: "2026-07-28",
    title: "Full-body strength",
    sport: "strength",
    durationMinutes: 50,
    completed: false,
    source: "plan",
  },
  {
    id: "seed-3",
    workoutDate: "2026-07-29",
    title: "Bike endurance",
    sport: "bike",
    durationMinutes: 75,
    distanceKm: 28,
    completed: false,
    source: "plan",
  },
  {
    id: "seed-4",
    workoutDate: "2026-07-30",
    title: "Recovery swim",
    sport: "swim",
    durationMinutes: 35,
    distanceKm: 1.4,
    completed: false,
    source: "plan",
  },
  {
    id: "seed-5",
    workoutDate: "2026-08-01",
    title: "Long run",
    sport: "run",
    durationMinutes: 80,
    distanceKm: 13,
    completed: false,
    source: "plan",
  },
  {
    id: "seed-6",
    workoutDate: "2026-08-02",
    title: "Rest + mobility",
    sport: "recovery",
    durationMinutes: 25,
    completed: false,
    source: "plan",
  },
];

export const seedStrengthEntries: StrengthEntry[] = [
  { id: "strength-1", performedOn: "2026-05-04", exercise: "Back squat", weightKg: 47.5, reps: 6, sets: 3 },
  { id: "strength-2", performedOn: "2026-05-25", exercise: "Back squat", weightKg: 50, reps: 6, sets: 3 },
  { id: "strength-3", performedOn: "2026-06-15", exercise: "Back squat", weightKg: 52.5, reps: 5, sets: 4 },
  { id: "strength-4", performedOn: "2026-07-06", exercise: "Back squat", weightKg: 55, reps: 5, sets: 4 },
  { id: "strength-5", performedOn: "2026-07-20", exercise: "Back squat", weightKg: 57.5, reps: 4, sets: 4 },
];

export const sportColors: Record<TrainingSport, string> = {
  run: "#d46a4c",
  bike: "#397f88",
  swim: "#4f78a8",
  strength: "#775b8f",
  recovery: "#7a8870",
};
