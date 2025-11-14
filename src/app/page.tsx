'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { UserProfile, QuizAnswers, WorkoutPlan } from '@/lib/types';
import { generateWorkoutPlan, calculateDailyCalories } from '@/lib/fitness-ai';
import { 
  saveUserProfile, 
  getUserProfile, 
  isQuizCompleted,
  saveWorkoutPlan,
  getWorkoutPlan,
  clearAllData 
} from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Dumbbell, 
  Target, 
  TrendingUp, 
  Activity,
  Clock,
  Flame,
  Apple,
  Calendar,
  User,
  Settings,
  LogOut,
  Home
} from 'lucide-react';
import Link from 'next/link';

export default function FitnessApp() {
  const searchParams = useSearchParams();
  const shouldStartQuiz = searchParams.get('quiz') === 'true';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Partial<QuizAnswers>>({});
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [dailyNutrition, setDailyNutrition] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('workout');
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    // Carregar dados do localStorage
    if (isQuizCompleted() && !shouldStartQuiz) {
      const profile = getUserProfile();
      const plan = getWorkoutPlan();
      
      if (profile) {
        setUserProfile(profile);
        const nutrition = calculateDailyCalories(profile);
        setDailyNutrition(nutrition);
      }
      
      if (plan) {
        setWorkoutPlan(plan);
      }
    } else if (shouldStartQuiz) {
      setShowQuiz(true);
    }
  }, [shouldStartQuiz]);

  const quizSteps = [
    {
      title: 'Informações Básicas',
      description: 'Vamos começar conhecendo você',
    },
    {
      title: 'Objetivos',
      description: 'Qual é o seu objetivo principal?',
    },
    {
      title: 'Nível de Experiência',
      description: 'Qual é o seu nível atual de condicionamento?',
    },
    {
      title: 'Preferências',
      description: 'Alguma restrição ou preferência?',
    },
  ];

  const handleQuizSubmit = () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Criar perfil do usuário
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      name: quizAnswers.name || '',
      age: quizAnswers.age || 0,
      gender: quizAnswers.gender || 'other',
      weight: quizAnswers.weight || 0,
      height: quizAnswers.height || 0,
      goal: quizAnswers.goal || 'maintain',
      fitnessLevel: quizAnswers.fitnessLevel || 'beginner',
      restrictions: quizAnswers.restrictions || [],
      dietaryPreferences: quizAnswers.dietaryPreferences || [],
      createdAt: new Date().toISOString(),
    };

    // Gerar plano de treino
    const plan = generateWorkoutPlan(profile);
    const nutrition = calculateDailyCalories(profile);

    // Salvar no localStorage
    saveUserProfile(profile);
    saveWorkoutPlan(plan);

    // Atualizar estado
    setUserProfile(profile);
    setWorkoutPlan(plan);
    setDailyNutrition(nutrition);
    setShowQuiz(false);
  };

  const handleRestart = () => {
    if (confirm('Tem certeza que deseja reiniciar? Todos os dados serão perdidos.')) {
      clearAllData();
      setUserProfile(null);
      setWorkoutPlan(null);
      setDailyNutrition(null);
      setQuizAnswers({});
      setCurrentStep(0);
      setShowQuiz(false);
    }
  };

  // Mostrar landing page se não tem perfil e não está no quiz
  if (!userProfile && !showQuiz) {
    // Redirect to landing page
    if (typeof window !== 'undefined') {
      window.location.href = '/landing';
    }
    return null;
  }

  // Quiz não completado - mostrar formulário
  if (!userProfile || showQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Back to Landing */}
          <div className="mb-4">
            <Link href="/landing">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Voltar para o site
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              FitLife Pro
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Seu personal trainer com inteligência artificial
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Passo {currentStep + 1} de {quizSteps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / quizSteps.length) * 100)}%
              </span>
            </div>
            <Progress value={((currentStep + 1) / quizSteps.length) * 100} className="h-2" />
          </div>

          {/* Quiz Card */}
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">{quizSteps[currentStep].title}</CardTitle>
              <CardDescription className="text-base">
                {quizSteps[currentStep].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 0: Informações Básicas */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome"
                      value={quizAnswers.name || ''}
                      onChange={(e) => setQuizAnswers({ ...quizAnswers, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Idade</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="25"
                        value={quizAnswers.age || ''}
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, age: parseInt(e.target.value) })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gênero</Label>
                      <RadioGroup
                        value={quizAnswers.gender}
                        onValueChange={(value: any) => setQuizAnswers({ ...quizAnswers, gender: value })}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male" className="font-normal">Masculino</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female" className="font-normal">Feminino</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other" className="font-normal">Outro</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weight">Peso (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="70"
                        value={quizAnswers.weight || ''}
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, weight: parseFloat(e.target.value) })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Altura (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="170"
                        value={quizAnswers.height || ''}
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, height: parseFloat(e.target.value) })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Objetivos */}
              {currentStep === 1 && (
                <RadioGroup
                  value={quizAnswers.goal}
                  onValueChange={(value: any) => setQuizAnswers({ ...quizAnswers, goal: value })}
                  className="space-y-3"
                >
                  <Card className={`cursor-pointer transition-all ${quizAnswers.goal === 'lose_weight' ? 'ring-2 ring-purple-500' : ''}`}>
                    <CardContent className="flex items-center space-x-3 p-4">
                      <RadioGroupItem value="lose_weight" id="lose_weight" />
                      <div className="flex-1">
                        <Label htmlFor="lose_weight" className="cursor-pointer font-semibold">
                          Perder Peso
                        </Label>
                        <p className="text-sm text-gray-500">Foco em queima de calorias e definição</p>
                      </div>
                      <Flame className="w-6 h-6 text-orange-500" />
                    </CardContent>
                  </Card>
                  <Card className={`cursor-pointer transition-all ${quizAnswers.goal === 'gain_muscle' ? 'ring-2 ring-purple-500' : ''}`}>
                    <CardContent className="flex items-center space-x-3 p-4">
                      <RadioGroupItem value="gain_muscle" id="gain_muscle" />
                      <div className="flex-1">
                        <Label htmlFor="gain_muscle" className="cursor-pointer font-semibold">
                          Ganhar Massa Muscular
                        </Label>
                        <p className="text-sm text-gray-500">Hipertrofia e força</p>
                      </div>
                      <Dumbbell className="w-6 h-6 text-blue-500" />
                    </CardContent>
                  </Card>
                  <Card className={`cursor-pointer transition-all ${quizAnswers.goal === 'improve_endurance' ? 'ring-2 ring-purple-500' : ''}`}>
                    <CardContent className="flex items-center space-x-3 p-4">
                      <RadioGroupItem value="improve_endurance" id="improve_endurance" />
                      <div className="flex-1">
                        <Label htmlFor="improve_endurance" className="cursor-pointer font-semibold">
                          Melhorar Resistência
                        </Label>
                        <p className="text-sm text-gray-500">Cardio e condicionamento</p>
                      </div>
                      <Activity className="w-6 h-6 text-green-500" />
                    </CardContent>
                  </Card>
                  <Card className={`cursor-pointer transition-all ${quizAnswers.goal === 'maintain' ? 'ring-2 ring-purple-500' : ''}`}>
                    <CardContent className="flex items-center space-x-3 p-4">
                      <RadioGroupItem value="maintain" id="maintain" />
                      <div className="flex-1">
                        <Label htmlFor="maintain" className="cursor-pointer font-semibold">
                          Manter Forma Atual
                        </Label>
                        <p className="text-sm text-gray-500">Equilíbrio e manutenção</p>
                      </div>
                      <Target className="w-6 h-6 text-purple-500" />
                    </CardContent>
                  </Card>
                </RadioGroup>
              )}

              {/* Step 2: Nível */}
              {currentStep === 2 && (
                <RadioGroup
                  value={quizAnswers.fitnessLevel}
                  onValueChange={(value: any) => setQuizAnswers({ ...quizAnswers, fitnessLevel: value })}
                  className="space-y-3"
                >
                  <Card className={`cursor-pointer transition-all ${quizAnswers.fitnessLevel === 'beginner' ? 'ring-2 ring-purple-500' : ''}`}>
                    <CardContent className="flex items-center space-x-3 p-4">
                      <RadioGroupItem value="beginner" id="beginner" />
                      <div className="flex-1">
                        <Label htmlFor="beginner" className="cursor-pointer font-semibold">
                          Iniciante
                        </Label>
                        <p className="text-sm text-gray-500">Pouca ou nenhuma experiência com exercícios</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={`cursor-pointer transition-all ${quizAnswers.fitnessLevel === 'intermediate' ? 'ring-2 ring-purple-500' : ''}`}>
                    <CardContent className="flex items-center space-x-3 p-4">
                      <RadioGroupItem value="intermediate" id="intermediate" />
                      <div className="flex-1">
                        <Label htmlFor="intermediate" className="cursor-pointer font-semibold">
                          Intermediário
                        </Label>
                        <p className="text-sm text-gray-500">Treino regular há alguns meses</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={`cursor-pointer transition-all ${quizAnswers.fitnessLevel === 'advanced' ? 'ring-2 ring-purple-500' : ''}`}>
                    <CardContent className="flex items-center space-x-3 p-4">
                      <RadioGroupItem value="advanced" id="advanced" />
                      <div className="flex-1">
                        <Label htmlFor="advanced" className="cursor-pointer font-semibold">
                          Avançado
                        </Label>
                        <p className="text-sm text-gray-500">Experiência consistente há mais de 1 ano</p>
                      </div>
                    </CardContent>
                  </Card>
                </RadioGroup>
              )}

              {/* Step 3: Preferências */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-base mb-3 block">Restrições Físicas</Label>
                    <div className="space-y-2">
                      {['Nenhuma', 'Problemas nos joelhos', 'Problemas nas costas', 'Problemas nos ombros'].map((restriction) => (
                        <div key={restriction} className="flex items-center space-x-2">
                          <Checkbox
                            id={restriction}
                            checked={quizAnswers.restrictions?.includes(restriction)}
                            onCheckedChange={(checked) => {
                              const current = quizAnswers.restrictions || [];
                              if (checked) {
                                setQuizAnswers({ ...quizAnswers, restrictions: [...current, restriction] });
                              } else {
                                setQuizAnswers({ ...quizAnswers, restrictions: current.filter(r => r !== restriction) });
                              }
                            }}
                          />
                          <Label htmlFor={restriction} className="font-normal cursor-pointer">
                            {restriction}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-base mb-3 block">Preferências Alimentares</Label>
                    <div className="space-y-2">
                      {['Sem restrições', 'Vegetariano', 'Vegano', 'Sem lactose', 'Sem glúten'].map((pref) => (
                        <div key={pref} className="flex items-center space-x-2">
                          <Checkbox
                            id={pref}
                            checked={quizAnswers.dietaryPreferences?.includes(pref)}
                            onCheckedChange={(checked) => {
                              const current = quizAnswers.dietaryPreferences || [];
                              if (checked) {
                                setQuizAnswers({ ...quizAnswers, dietaryPreferences: [...current, pref] });
                              } else {
                                setQuizAnswers({ ...quizAnswers, dietaryPreferences: current.filter(p => p !== pref) });
                              }
                            }}
                          />
                          <Label htmlFor={pref} className="font-normal cursor-pointer">
                            {pref}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                )}
                <Button
                  onClick={handleQuizSubmit}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  disabled={
                    (currentStep === 0 && (!quizAnswers.name || !quizAnswers.age || !quizAnswers.weight || !quizAnswers.height)) ||
                    (currentStep === 1 && !quizAnswers.goal) ||
                    (currentStep === 2 && !quizAnswers.fitnessLevel)
                  }
                >
                  {currentStep === quizSteps.length - 1 ? 'Gerar Meu Plano' : 'Continuar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Dashboard principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  FitLife Pro
                </h1>
                <p className="text-xs text-gray-500">Olá, {userProfile.name}!</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRestart}
              className="text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Reiniciar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Meta Diária</p>
                  <p className="text-3xl font-bold">{dailyNutrition?.calories}</p>
                  <p className="text-purple-100 text-xs">calorias</p>
                </div>
                <Flame className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm">Proteína</p>
                  <p className="text-3xl font-bold">{dailyNutrition?.protein}g</p>
                  <p className="text-pink-100 text-xs">por dia</p>
                </div>
                <Apple className="w-12 h-12 text-pink-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Carboidratos</p>
                  <p className="text-3xl font-bold">{dailyNutrition?.carbs}g</p>
                  <p className="text-orange-100 text-xs">por dia</p>
                </div>
                <Activity className="w-12 h-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Gorduras</p>
                  <p className="text-3xl font-bold">{dailyNutrition?.fats}g</p>
                  <p className="text-blue-100 text-xs">por dia</p>
                </div>
                <Target className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="workout" className="flex items-center gap-2 py-3">
              <Dumbbell className="w-4 h-4" />
              <span className="hidden sm:inline">Treinos</span>
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="flex items-center gap-2 py-3">
              <Apple className="w-4 h-4" />
              <span className="hidden sm:inline">Alimentação</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2 py-3">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Progresso</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 py-3">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
          </TabsList>

          {/* Workout Tab */}
          <TabsContent value="workout" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-purple-500" />
                  {workoutPlan?.name}
                </CardTitle>
                <CardDescription>{workoutPlan?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workoutPlan?.exercises.map((exercise, index) => (
                    <Card key={exercise.id} className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{exercise.name}</h3>
                            <p className="text-sm text-gray-500 capitalize">{exercise.category}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            exercise.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                            exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {exercise.difficulty === 'easy' ? 'Fácil' : exercise.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mb-3 text-sm">
                          {exercise.sets && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Target className="w-4 h-4" />
                              <span>{exercise.sets} séries</span>
                            </div>
                          )}
                          {exercise.reps && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Activity className="w-4 h-4" />
                              <span>{exercise.reps} reps</span>
                            </div>
                          )}
                          {exercise.duration && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{exercise.duration} min</span>
                            </div>
                          )}
                          {exercise.restTime && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{exercise.restTime}s descanso</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600">{exercise.instructions}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nutrition Tab - Placeholder */}
          <TabsContent value="nutrition">
            <Card>
              <CardHeader>
                <CardTitle>Diário Alimentar</CardTitle>
                <CardDescription>Em breve: registre suas refeições e acompanhe macros</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Apple className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Funcionalidade disponível no Módulo 2</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab - Placeholder */}
          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Acompanhamento de Progresso</CardTitle>
                <CardDescription>Em breve: registre peso, medidas e fotos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Funcionalidade disponível no Módulo 2</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Seu Perfil</CardTitle>
                <CardDescription>Informações e configurações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-500">Nome</Label>
                    <p className="font-medium">{userProfile.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Idade</Label>
                    <p className="font-medium">{userProfile.age} anos</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Peso</Label>
                    <p className="font-medium">{userProfile.weight} kg</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Altura</Label>
                    <p className="font-medium">{userProfile.height} cm</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Objetivo</Label>
                    <p className="font-medium capitalize">
                      {userProfile.goal === 'lose_weight' ? 'Perder Peso' :
                       userProfile.goal === 'gain_muscle' ? 'Ganhar Massa' :
                       userProfile.goal === 'improve_endurance' ? 'Melhorar Resistência' :
                       'Manter Forma'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Nível</Label>
                    <p className="font-medium capitalize">
                      {userProfile.fitnessLevel === 'beginner' ? 'Iniciante' :
                       userProfile.fitnessLevel === 'intermediate' ? 'Intermediário' :
                       'Avançado'}
                    </p>
                  </div>
                </div>
                
                {userProfile.restrictions && userProfile.restrictions.length > 0 && (
                  <div>
                    <Label className="text-sm text-gray-500 mb-2 block">Restrições</Label>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.restrictions.map((r, i) => (
                        <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {userProfile.dietaryPreferences && userProfile.dietaryPreferences.length > 0 && (
                  <div>
                    <Label className="text-sm text-gray-500 mb-2 block">Preferências Alimentares</Label>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.dietaryPreferences.map((p, i) => (
                        <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
