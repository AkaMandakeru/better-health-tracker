import React, { useState, useEffect } from "react";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { ScrollView } from "@/components/ui/scroll-view";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { useSession } from "../authContext";
import { apiService } from "@/services/api";
import { DailyTracking, HealthGoals } from "@/types";
import { Droplet, Dumbbell, Plus, Minus, LogOut, CheckCircle } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { useRouter } from "expo-router";

export default function DashboardScreen() {
  const { user, signOut } = useSession();
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [todayTracking, setTodayTracking] = useState<DailyTracking | null>(null);
  const [goals, setGoals] = useState<HealthGoals | null>(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [tracking, userGoals] = await Promise.all([
        apiService.getDailyTracking(user.id, today),
        apiService.getGoals(user.id),
      ]);

      setTodayTracking(tracking);
      setGoals(userGoals);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleAddWater = async () => {
    if (!user || isLoading) return;

    setIsLoading(true);
    try {
      const updated = await apiService.addWaterBottle(user.id, today);
      setTodayTracking(updated);
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="accent" action="success">
              <ToastTitle>Water added!</ToastTitle>
            </Toast>
          );
        },
      });
    } catch (error) {
      console.error("Error adding water:", error);
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="accent" action="error">
              <ToastTitle>Failed to update. Please try again.</ToastTitle>
            </Toast>
          );
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteWorkout = async () => {
    console.log("handleCompleteWorkout called", { user: !!user, isLoading, workouts });
    if (!user || isLoading) {
      console.log("Early return from handleCompleteWorkout");
      return;
    }

    console.log("Setting loading state and calling API");
    setIsLoading(true);
    try {
      const updated = await apiService.completeWorkout(user.id, today);
      console.log("Workout completed, updated tracking:", updated);
      setTodayTracking(updated);
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="accent" action="success">
              <ToastTitle>Workout completed!</ToastTitle>
            </Toast>
          );
        },
      });
    } catch (error) {
      console.error("Error completing workout:", error);
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="accent" action="error">
              <ToastTitle>Failed to update. Please try again.</ToastTitle>
            </Toast>
          );
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const waterBottles = todayTracking?.waterBottles || 0;
  const workouts = todayTracking?.workoutsCompleted || 0;
  const waterGoal = goals?.waterBottlesPerDay || 8;
  const workoutGoal = goals?.workoutDaysPerWeek || 3;
  const waterProgress = Math.min((waterBottles / waterGoal) * 100, 100);
  const workoutProgress = workouts > 0 ? 100 : 0;
  const isWaterGoalComplete = waterBottles >= waterGoal;

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <ScrollView className="flex-1">
        <VStack className="p-6" space="xl">
          <HStack className="items-center justify-between">
            <VStack space="xs">
              <Heading size="2xl">Today's Progress</Heading>
              <Text className="text-typography-500">
                Track your daily health activities
              </Text>
            </VStack>
            <Pressable
              onPress={async () => {
                await signOut();
                router.replace('/login');
              }}
              className="p-2"
            >
              <Icon as={LogOut} size="md" className="text-typography-500" />
            </Pressable>
          </HStack>

          {/* Water Tracking Card */}
          <VStack className="p-5 rounded-xl bg-white border border-gray-200" space="md">
            <HStack className="items-center justify-between">
              <HStack className="items-center" space="sm">
                {isWaterGoalComplete ? (
                  <Icon as={CheckCircle} size="xl" className="text-green-600" />
                ) : (
                  <Icon as={Droplet} size="xl" className="text-primary-600" />
                )}
                <VStack>
                  <Heading size="lg">Water Intake</Heading>
                  <Text className="text-typography-500">
                    {waterBottles} / {waterGoal} bottles
                    {isWaterGoalComplete && " ✓"}
                  </Text>
                </VStack>
              </HStack>
              {isWaterGoalComplete && (
                <VStack className="items-end">
                  <Text className="text-xs font-semibold text-green-600">
                    Complete!
                  </Text>
                </VStack>
              )}
            </HStack>

            {/* Progress Bar */}
            <VStack space="xs">
              <HStack className={`w-full h-3 rounded-full overflow-hidden ${isWaterGoalComplete ? 'bg-green-100' : 'bg-primary-100'}`}>
                <VStack
                  className={`h-full rounded-full ${isWaterGoalComplete ? 'bg-green-600' : 'bg-primary-600'}`}
                  style={{ width: `${waterProgress}%` }}
                />
              </HStack>
              <Text className={`text-xs ${isWaterGoalComplete ? 'text-green-600 font-semibold' : 'text-typography-400'}`}>
                {isWaterGoalComplete ? "Goal achieved! 🎉" : `${Math.round(waterProgress)}% of daily goal`}
              </Text>
            </VStack>

            <HStack className="items-center justify-center" space="md">
              <Pressable
                onPress={handleAddWater}
                className="p-3 bg-primary-600 rounded-lg active:opacity-70"
              >
                <Icon as={Plus} size="md" className="text-white" />
              </Pressable>
              <Text className="text-2xl font-bold">{waterBottles}</Text>
            </HStack>
          </VStack>

          {/* Workout Tracking Card */}
          <VStack className="p-5 bg-secondary-50 rounded-xl" space="md">
            <HStack className="items-center justify-between">
              <HStack className="items-center" space="sm">
                <Icon as={Dumbbell} size="xl" className="text-secondary-600" />
                <VStack>
                  <Heading size="lg">Workouts</Heading>
                  <Text className="text-typography-500">
                    {workouts} completed today
                  </Text>
                </VStack>
              </HStack>
            </HStack>

            {/* Progress Bar */}
            <VStack space="xs">
              <HStack className="w-full h-3 bg-secondary-100 rounded-full overflow-hidden">
                <VStack
                  className="h-full bg-secondary-600 rounded-full"
                  style={{ width: `${workoutProgress}%` }}
                />
              </HStack>
              <Text className="text-xs text-typography-400">
                {workoutProgress > 0 ? "Goal achieved!" : "Complete a workout to reach your goal"}
              </Text>
            </VStack>

            <HStack className="items-center justify-center" space="md">
              <Button
                variant="outline"
                action="secondary"
                onPress={handleCompleteWorkout}
                isDisabled={isLoading || !user}
                className="flex-1"
              >
                <ButtonText>
                  {workouts > 0 ? `Workout Completed (${workouts}) ✓` : "Mark Workout Complete"}
                </ButtonText>
              </Button>
            </HStack>
          </VStack>

          {/* Summary Stats */}
          <VStack className="p-5 bg-background-50 rounded-xl" space="md">
            <Heading size="md">Today's Summary</Heading>
            <VStack space="sm">
              <HStack className="justify-between items-center">
                <Text>Water Progress</Text>
                <Text className={`font-semibold ${isWaterGoalComplete ? 'text-green-600' : ''}`}>
                  {waterBottles}/{waterGoal} bottles ({Math.round(waterProgress)}%)
                  {isWaterGoalComplete && " ✓"}
                </Text>
              </HStack>
              <HStack className="justify-between items-center">
                <Text>Workout Status</Text>
                <Text className="font-semibold">
                  {workouts > 0 ? "✓ Completed" : "Not completed"}
                </Text>
              </HStack>
              {goals?.currentWeight && (
                <HStack className="justify-between items-center">
                  <Text>Current Weight</Text>
                  <Text className="font-semibold">{goals.currentWeight} kg</Text>
                </HStack>
              )}
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}

