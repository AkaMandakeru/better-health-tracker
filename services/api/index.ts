// Mock API service for health tracking
// This will be replaced with real API calls later

import {
  HealthGoals,
  DailyTracking,
  WeeklyReport,
  MonthlyReport,
  User
} from '@/types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage (in real app, this would be API calls)
// Store goals and trackings per user
const mockGoalsByUser: Map<string, HealthGoals> = new Map();
const mockDailyTrackingsByUser: Map<string, DailyTracking[]> = new Map();

// Helper to get or initialize user's goals
const getUserGoals = (userId: string): HealthGoals => {
  if (!mockGoalsByUser.has(userId)) {
    mockGoalsByUser.set(userId, {
      id: `goal-${userId}`,
      userId,
      workoutDaysPerWeek: 3,
      waterBottlesPerDay: 8,
      targetWeight: 75,
      currentWeight: 80,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return mockGoalsByUser.get(userId)!;
};

// Helper to get or initialize user's trackings
const getUserTrackings = (userId: string): DailyTracking[] => {
  if (!mockDailyTrackingsByUser.has(userId)) {
    const trackings: DailyTracking[] = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const todayString = today.toISOString().split('T')[0];

      trackings.push({
        id: `tracking-${userId}-${i}`,
        userId,
        date: dateString,
        waterBottles: dateString === todayString ? 0 : Math.floor(Math.random() * 10) + 1,
        workoutsCompleted: dateString === todayString ? 0 : (Math.random() > 0.5 ? 1 : 0),
        weight: i % 7 === 0 ? 80 - (i * 0.1) : undefined,
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
      });
    }
    mockDailyTrackingsByUser.set(userId, trackings);
  }
  return mockDailyTrackingsByUser.get(userId)!;
};

export const apiService = {
  // Health Goals
  async getGoals(userId: string): Promise<HealthGoals | null> {
    await delay(500);
    return getUserGoals(userId);
  },

  async updateGoals(userId: string, goals: Partial<HealthGoals>): Promise<HealthGoals> {
    await delay(500);
    const currentGoals = getUserGoals(userId);
    const updated = {
      ...currentGoals,
      ...goals,
      updatedAt: new Date().toISOString(),
    };
    mockGoalsByUser.set(userId, updated);
    return updated;
  },

  // Daily Tracking
  async getDailyTracking(userId: string, date: string): Promise<DailyTracking | null> {
    await delay(300);
    const trackings = getUserTrackings(userId);
    return trackings.find(t => t.date === date && t.userId === userId) || null;
  },

  async getDailyTrackings(userId: string, startDate?: string, endDate?: string): Promise<DailyTracking[]> {
    await delay(300);
    let trackings = getUserTrackings(userId);

    if (startDate) {
      trackings = trackings.filter(t => t.date >= startDate);
    }
    if (endDate) {
      trackings = trackings.filter(t => t.date <= endDate);
    }

    return trackings.sort((a, b) => b.date.localeCompare(a.date));
  },

  async updateDailyTracking(userId: string, date: string, data: Partial<DailyTracking>): Promise<DailyTracking> {
    await delay(300);
    const trackings = getUserTrackings(userId);
    const existing = trackings.find(t => t.date === date && t.userId === userId);

    if (existing) {
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      const updatedTrackings = trackings.map(t => (t.date === date && t.userId === userId) ? updated : t);
      mockDailyTrackingsByUser.set(userId, updatedTrackings);
      return updated;
    } else {
      const newTracking: DailyTracking = {
        id: `tracking-${userId}-${Date.now()}`,
        userId,
        date,
        waterBottles: 0,
        workoutsCompleted: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      };
      trackings.push(newTracking);
      mockDailyTrackingsByUser.set(userId, trackings);
      return newTracking;
    }
  },

  async addWaterBottle(userId: string, date: string): Promise<DailyTracking> {
    await delay(300);
    const existing = await this.getDailyTracking(userId, date);
    const currentBottles = existing?.waterBottles || 0;
    return this.updateDailyTracking(userId, date, { waterBottles: currentBottles + 1 });
  },

  async completeWorkout(userId: string, date: string): Promise<DailyTracking> {
    await delay(300);
    const existing = await this.getDailyTracking(userId, date);
    const currentWorkouts = existing?.workoutsCompleted || 0;
    return this.updateDailyTracking(userId, date, { workoutsCompleted: currentWorkouts + 1 });
  },

  // Reports
  async getWeeklyReport(userId: string, weekStart: string): Promise<WeeklyReport> {
    await delay(500);
    const weekEnd = new Date(new Date(weekStart).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const trackings = getUserTrackings(userId);
    const weekTrackings = trackings.filter(
      t => t.date >= weekStart && t.date <= weekEnd && t.userId === userId
    );

    const totalWorkouts = weekTrackings.reduce((sum, t) => sum + t.workoutsCompleted, 0);
    const totalWaterBottles = weekTrackings.reduce((sum, t) => sum + t.waterBottles, 0);
    const workoutDays = weekTrackings.filter(t => t.workoutsCompleted > 0).length;
    const waterDays = weekTrackings.filter(t => t.waterBottles > 0).length;
    const weights = weekTrackings.filter(t => t.weight).map(t => t.weight!);
    const averageWeight = weights.length > 0
      ? weights.reduce((sum, w) => sum + w, 0) / weights.length
      : undefined;

    return {
      weekStart,
      weekEnd,
      totalWorkouts,
      totalWaterBottles,
      averageWeight,
      workoutDays,
      waterDays,
      goals: getUserGoals(userId),
    };
  },

  async getMonthlyReport(userId: string, month: string): Promise<MonthlyReport> {
    await delay(500);
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = `${year}-${String(monthNum).padStart(2, '0')}-01`;
    const endDate = new Date(year, monthNum, 0).toISOString().split('T')[0];

    const trackings = getUserTrackings(userId);
    const monthTrackings = trackings.filter(
      t => t.date >= startDate && t.date <= endDate && t.userId === userId
    );

    const totalWorkouts = monthTrackings.reduce((sum, t) => sum + t.workoutsCompleted, 0);
    const totalWaterBottles = monthTrackings.reduce((sum, t) => sum + t.waterBottles, 0);
    const workoutDays = monthTrackings.filter(t => t.workoutsCompleted > 0).length;
    const waterDays = monthTrackings.filter(t => t.waterBottles > 0).length;
    const weights = monthTrackings.filter(t => t.weight).map(t => t.weight!);
    const averageWeight = weights.length > 0
      ? weights.reduce((sum, w) => sum + w, 0) / weights.length
      : undefined;

    return {
      month,
      totalWorkouts,
      totalWaterBottles,
      averageWeight,
      workoutDays,
      waterDays,
      goals: getUserGoals(userId),
    };
  },
};

