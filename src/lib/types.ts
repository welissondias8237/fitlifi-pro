// Tipos do aplicativo de fitness

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number; // kg
  height: number; // cm
  goal: 'lose_weight' | 'gain_muscle' | 'maintain' | 'improve_endurance';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  restrictions: string[];
  dietaryPreferences: string[];
  createdAt: string;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  description: string;
  duration: number; // weeks
  exercises: Exercise[];
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'cardio' | 'strength' | 'flexibility' | 'balance';
  sets?: number;
  reps?: string;
  duration?: number; // minutes
  restTime?: number; // seconds
  instructions: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  calories: number;
  protein: number; // g
  carbs: number; // g
  fats: number; // g
  foods: FoodItem[];
}

export interface FoodItem {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface ProgressEntry {
  id: string;
  userId: string;
  date: string;
  weight?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  mood?: 'great' | 'good' | 'okay' | 'tired' | 'unmotivated';
  notes?: string;
  photoUrl?: string;
}

export interface QuizAnswers {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  goal: 'lose_weight' | 'gain_muscle' | 'maintain' | 'improve_endurance';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  restrictions: string[];
  dietaryPreferences: string[];
}
