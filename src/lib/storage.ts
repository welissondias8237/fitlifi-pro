// Gerenciamento de Local Storage para persistência

import { UserProfile, WorkoutPlan, Meal, ProgressEntry } from './types';

const STORAGE_KEYS = {
  USER_PROFILE: 'fitness_user_profile',
  WORKOUT_PLAN: 'fitness_workout_plan',
  MEALS: 'fitness_meals',
  PROGRESS: 'fitness_progress',
  QUIZ_COMPLETED: 'fitness_quiz_completed',
};

// User Profile
export function saveUserProfile(profile: UserProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    localStorage.setItem(STORAGE_KEYS.QUIZ_COMPLETED, 'true');
  }
}

export function getUserProfile(): UserProfile | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

export function isQuizCompleted(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEYS.QUIZ_COMPLETED) === 'true';
  }
  return false;
}

// Workout Plan
export function saveWorkoutPlan(plan: WorkoutPlan): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.WORKOUT_PLAN, JSON.stringify(plan));
  }
}

export function getWorkoutPlan(): WorkoutPlan | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_PLAN);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

// Meals
export function saveMeal(meal: Meal): void {
  if (typeof window !== 'undefined') {
    const meals = getMeals();
    meals.push(meal);
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  }
}

export function getMeals(): Meal[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEYS.MEALS);
    return data ? JSON.parse(data) : [];
  }
  return [];
}

export function getMealsByDate(date: string): Meal[] {
  return getMeals().filter(meal => meal.date === date);
}

export function deleteMeal(mealId: string): void {
  if (typeof window !== 'undefined') {
    const meals = getMeals().filter(meal => meal.id !== mealId);
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  }
}

// Progress
export function saveProgressEntry(entry: ProgressEntry): void {
  if (typeof window !== 'undefined') {
    const progress = getProgressEntries();
    // Remove entrada existente da mesma data se houver
    const filtered = progress.filter(p => p.date !== entry.date);
    filtered.push(entry);
    // Ordena por data (mais recente primeiro)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(filtered));
  }
}

export function getProgressEntries(): ProgressEntry[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return data ? JSON.parse(data) : [];
  }
  return [];
}

export function deleteProgressEntry(entryId: string): void {
  if (typeof window !== 'undefined') {
    const progress = getProgressEntries().filter(entry => entry.id !== entryId);
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  }
}

// Clear all data
export function clearAllData(): void {
  if (typeof window !== 'undefined') {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
