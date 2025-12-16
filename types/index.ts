// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider?: 'email' | 'google' | 'apple' | 'facebook' | 'instagram';
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Health tracking types
export interface HealthGoals {
  id: string;
  userId: string;
  workoutDaysPerWeek: number;
  waterBottlesPerDay: number;
  targetWeight?: number;
  currentWeight?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DailyTracking {
  id: string;
  userId: string;
  date: string; // ISO date string
  waterBottles: number;
  workoutsCompleted: number;
  weight?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  totalWorkouts: number;
  totalWaterBottles: number;
  averageWeight?: number;
  workoutDays: number;
  waterDays: number;
  goals: HealthGoals;
}

export interface MonthlyReport {
  month: string; // YYYY-MM
  totalWorkouts: number;
  totalWaterBottles: number;
  averageWeight?: number;
  workoutDays: number;
  waterDays: number;
  goals: HealthGoals;
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  type: 'weekly' | 'monthly';
}

