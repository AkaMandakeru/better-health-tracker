import React, { useState, useEffect } from "react";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { ScrollView } from "@/components/ui/scroll-view";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { useSession } from "../authContext";
import { apiService } from "@/services/api";
import { HealthGoals } from "@/types";

export default function GoalsScreen() {
  const { user } = useSession();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [goals, setGoals] = useState<HealthGoals | null>(null);
  const [formData, setFormData] = useState({
    workoutDaysPerWeek: "3",
    waterBottlesPerDay: "8",
    targetWeight: "",
    currentWeight: "",
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    if (!user) return;

    try {
      const userGoals = await apiService.getGoals(user.id);
      if (userGoals) {
        setGoals(userGoals);
        setFormData({
          workoutDaysPerWeek: userGoals.workoutDaysPerWeek.toString(),
          waterBottlesPerDay: userGoals.waterBottlesPerDay.toString(),
          targetWeight: userGoals.targetWeight?.toString() || "",
          currentWeight: userGoals.currentWeight?.toString() || "",
        });
      }
    } catch (error) {
      console.error("Error loading goals:", error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updatedGoals = await apiService.updateGoals(user.id, {
        workoutDaysPerWeek: parseInt(formData.workoutDaysPerWeek) || 3,
        waterBottlesPerDay: parseInt(formData.waterBottlesPerDay) || 8,
        targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : undefined,
        currentWeight: formData.currentWeight ? parseFloat(formData.currentWeight) : undefined,
      });

      setGoals(updatedGoals);
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="accent" action="success">
              <ToastTitle>Goals updated successfully!</ToastTitle>
            </Toast>
          );
        },
      });
    } catch (error) {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="accent" action="error">
              <ToastTitle>Failed to update goals. Please try again.</ToastTitle>
            </Toast>
          );
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <ScrollView className="flex-1">
        <VStack className="p-6" space="xl">
          <VStack space="md">
            <Heading size="2xl">Set Your Goals</Heading>
            <Text className="text-typography-500">
              Define your health and fitness targets to track your progress
            </Text>
          </VStack>

          <VStack space="lg">
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Workout Days Per Week</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="e.g., 3"
                  keyboardType="numeric"
                  value={formData.workoutDaysPerWeek}
                  onChangeText={(value) =>
                    setFormData({ ...formData, workoutDaysPerWeek: value })
                  }
                />
              </Input>
              <Text className="text-typography-400 text-sm mt-1">
                How many days per week do you want to work out?
              </Text>
            </FormControl>

            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Water Bottles Per Day</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="e.g., 8"
                  keyboardType="numeric"
                  value={formData.waterBottlesPerDay}
                  onChangeText={(value) =>
                    setFormData({ ...formData, waterBottlesPerDay: value })
                  }
                />
              </Input>
              <Text className="text-typography-400 text-sm mt-1">
                How many bottles of water do you want to drink daily?
              </Text>
            </FormControl>

            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Current Weight (kg)</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="e.g., 75"
                  keyboardType="decimal-pad"
                  value={formData.currentWeight}
                  onChangeText={(value) =>
                    setFormData({ ...formData, currentWeight: value })
                  }
                />
              </Input>
            </FormControl>

            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Target Weight (kg)</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="e.g., 70"
                  keyboardType="decimal-pad"
                  value={formData.targetWeight}
                  onChangeText={(value) =>
                    setFormData({ ...formData, targetWeight: value })
                  }
                />
              </Input>
            </FormControl>
          </VStack>

          <Button
            className="w-full"
            onPress={handleSave}
            isDisabled={isLoading}
          >
            <ButtonText className="font-medium">
              {isLoading ? "Saving..." : "Save Goals"}
            </ButtonText>
          </Button>

          {goals && (
            <VStack className="mt-4 p-4 bg-primary-50 rounded-lg" space="sm">
              <Text className="font-semibold">Current Goals</Text>
              <HStack className="justify-between">
                <Text>Workout Days/Week:</Text>
                <Text className="font-semibold">{goals.workoutDaysPerWeek}</Text>
              </HStack>
              <HStack className="justify-between">
                <Text>Water Bottles/Day:</Text>
                <Text className="font-semibold">{goals.waterBottlesPerDay}</Text>
              </HStack>
              {goals.currentWeight && (
                <HStack className="justify-between">
                  <Text>Current Weight:</Text>
                  <Text className="font-semibold">{goals.currentWeight} kg</Text>
                </HStack>
              )}
              {goals.targetWeight && (
                <HStack className="justify-between">
                  <Text>Target Weight:</Text>
                  <Text className="font-semibold">{goals.targetWeight} kg</Text>
                </HStack>
              )}
            </VStack>
          )}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}

