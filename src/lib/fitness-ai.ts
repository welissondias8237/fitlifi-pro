// Gerador de planos de treino personalizados com IA

import { UserProfile, WorkoutPlan, Exercise } from './types';

export function generateWorkoutPlan(profile: UserProfile): WorkoutPlan {
  const exercises = getExercisesForProfile(profile);
  
  return {
    id: crypto.randomUUID(),
    userId: profile.id,
    name: `Plano ${getGoalName(profile.goal)} - ${profile.fitnessLevel}`,
    description: generatePlanDescription(profile),
    duration: 8, // 8 semanas
    exercises,
    createdAt: new Date().toISOString(),
  };
}

function getExercisesForProfile(profile: UserProfile): Exercise[] {
  const baseExercises: Exercise[] = [];
  
  // Exercícios baseados no objetivo
  if (profile.goal === 'lose_weight') {
    baseExercises.push(
      {
        id: '1',
        name: 'Corrida ou Caminhada Rápida',
        category: 'cardio',
        duration: profile.fitnessLevel === 'beginner' ? 20 : profile.fitnessLevel === 'intermediate' ? 30 : 45,
        instructions: 'Mantenha um ritmo constante. Aqueça por 5 minutos antes de começar.',
        difficulty: profile.fitnessLevel === 'beginner' ? 'easy' : profile.fitnessLevel === 'intermediate' ? 'medium' : 'hard',
      },
      {
        id: '2',
        name: 'Burpees',
        category: 'cardio',
        sets: profile.fitnessLevel === 'beginner' ? 3 : 4,
        reps: profile.fitnessLevel === 'beginner' ? '8-10' : profile.fitnessLevel === 'intermediate' ? '12-15' : '15-20',
        restTime: 60,
        instructions: 'Movimento completo: agachamento, prancha, flexão, pulo. Mantenha o core ativado.',
        difficulty: profile.fitnessLevel === 'beginner' ? 'medium' : 'hard',
      },
      {
        id: '3',
        name: 'Mountain Climbers',
        category: 'cardio',
        sets: 3,
        duration: profile.fitnessLevel === 'beginner' ? 1 : 2,
        restTime: 45,
        instructions: 'Posição de prancha, alterne joelhos ao peito rapidamente.',
        difficulty: 'medium',
      }
    );
  }
  
  if (profile.goal === 'gain_muscle') {
    baseExercises.push(
      {
        id: '4',
        name: 'Agachamento Livre',
        category: 'strength',
        sets: profile.fitnessLevel === 'beginner' ? 3 : 4,
        reps: profile.fitnessLevel === 'beginner' ? '10-12' : '12-15',
        restTime: 90,
        instructions: 'Pés na largura dos ombros, desça até 90 graus, mantenha as costas retas.',
        difficulty: profile.fitnessLevel === 'beginner' ? 'easy' : 'medium',
      },
      {
        id: '5',
        name: 'Flexões',
        category: 'strength',
        sets: profile.fitnessLevel === 'beginner' ? 3 : 4,
        reps: profile.fitnessLevel === 'beginner' ? '8-10' : profile.fitnessLevel === 'intermediate' ? '12-15' : '15-20',
        restTime: 60,
        instructions: 'Mãos na largura dos ombros, desça até o peito quase tocar o chão.',
        difficulty: profile.fitnessLevel === 'beginner' ? 'medium' : 'easy',
      },
      {
        id: '6',
        name: 'Remada com Halteres',
        category: 'strength',
        sets: 4,
        reps: '10-12',
        restTime: 75,
        instructions: 'Incline o tronco, puxe os halteres em direção ao quadril, contraia as costas.',
        difficulty: 'medium',
      },
      {
        id: '7',
        name: 'Desenvolvimento de Ombros',
        category: 'strength',
        sets: 3,
        reps: '10-12',
        restTime: 60,
        instructions: 'Empurre os halteres acima da cabeça, mantenha o core estável.',
        difficulty: 'medium',
      }
    );
  }
  
  if (profile.goal === 'improve_endurance') {
    baseExercises.push(
      {
        id: '8',
        name: 'Corrida Intervalada',
        category: 'cardio',
        duration: 25,
        instructions: '5 min aquecimento, 8x (1 min rápido + 1 min lento), 5 min desaquecimento.',
        difficulty: profile.fitnessLevel === 'beginner' ? 'medium' : 'hard',
      },
      {
        id: '9',
        name: 'Ciclismo ou Bicicleta Ergométrica',
        category: 'cardio',
        duration: profile.fitnessLevel === 'beginner' ? 30 : 45,
        instructions: 'Mantenha cadência constante, ajuste resistência conforme necessário.',
        difficulty: 'medium',
      }
    );
  }
  
  // Adiciona exercícios de flexibilidade para todos
  baseExercises.push(
    {
      id: '10',
      name: 'Alongamento Completo',
      category: 'flexibility',
      duration: 10,
      instructions: 'Alongue todos os grupos musculares principais por 30 segundos cada.',
      difficulty: 'easy',
    }
  );
  
  return baseExercises;
}

function getGoalName(goal: string): string {
  const goals: Record<string, string> = {
    lose_weight: 'Perda de Peso',
    gain_muscle: 'Ganho de Massa',
    maintain: 'Manutenção',
    improve_endurance: 'Resistência',
  };
  return goals[goal] || 'Personalizado';
}

function generatePlanDescription(profile: UserProfile): string {
  const goalDescriptions: Record<string, string> = {
    lose_weight: 'Plano focado em queima de calorias com exercícios cardiovasculares intensos e treino funcional.',
    gain_muscle: 'Programa de hipertrofia com foco em exercícios de força e construção muscular progressiva.',
    maintain: 'Rotina equilibrada para manter sua forma física atual com variedade de exercícios.',
    improve_endurance: 'Treino cardiovascular progressivo para aumentar resistência e capacidade aeróbica.',
  };
  
  const levelDescriptions: Record<string, string> = {
    beginner: 'Adaptado para iniciantes com progressão gradual.',
    intermediate: 'Desafios moderados para quem já tem experiência.',
    advanced: 'Treinos intensos para atletas experientes.',
  };
  
  return `${goalDescriptions[profile.goal]} ${levelDescriptions[profile.fitnessLevel]}`;
}

export function calculateDailyCalories(profile: UserProfile): {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
} {
  // Fórmula de Harris-Benedict para TMB (Taxa Metabólica Basal)
  let bmr: number;
  
  if (profile.gender === 'male') {
    bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
  } else {
    bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
  }
  
  // Fator de atividade baseado no nível de fitness
  const activityFactors: Record<string, number> = {
    beginner: 1.375, // Exercício leve
    intermediate: 1.55, // Exercício moderado
    advanced: 1.725, // Exercício intenso
  };
  
  let tdee = bmr * activityFactors[profile.fitnessLevel];
  
  // Ajuste baseado no objetivo
  if (profile.goal === 'lose_weight') {
    tdee -= 500; // Déficit de 500 calorias
  } else if (profile.goal === 'gain_muscle') {
    tdee += 300; // Superávit de 300 calorias
  }
  
  // Distribuição de macronutrientes
  const protein = profile.weight * (profile.goal === 'gain_muscle' ? 2.2 : 1.8); // g
  const fats = (tdee * 0.25) / 9; // 25% das calorias, 9 cal/g
  const carbs = (tdee - (protein * 4) - (fats * 9)) / 4; // Restante em carboidratos
  
  return {
    calories: Math.round(tdee),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fats: Math.round(fats),
  };
}
