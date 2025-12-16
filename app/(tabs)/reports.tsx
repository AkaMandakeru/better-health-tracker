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
import { WeeklyReport, MonthlyReport } from "@/types";
import { Calendar, TrendingUp, Droplet, Dumbbell } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export default function ReportsScreen() {
  const { user } = useSession();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [reportType, setReportType] = useState<"weekly" | "monthly">("weekly");
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadReport();
  }, [reportType, selectedDate]);

  const loadReport = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      if (reportType === "weekly") {
        const weekStart = format(startOfWeek(selectedDate, { weekStartsOn: 1 }), "yyyy-MM-dd");
        const report = await apiService.getWeeklyReport(user.id, weekStart);
        setWeeklyReport(report);
      } else {
        const month = format(selectedDate, "yyyy-MM");
        const report = await apiService.getMonthlyReport(user.id, month);
        setMonthlyReport(report);
      }
    } catch (error) {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="accent" action="error">
              <ToastTitle>Failed to load report. Please try again.</ToastTitle>
            </Toast>
          );
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousPeriod = () => {
    const newDate = new Date(selectedDate);
    if (reportType === "weekly") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setSelectedDate(newDate);
  };

  const handleNextPeriod = () => {
    const newDate = new Date(selectedDate);
    if (reportType === "weekly") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const getPeriodLabel = () => {
    if (reportType === "weekly") {
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
      return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
    } else {
      return format(selectedDate, "MMMM yyyy");
    }
  };

  const currentReport = reportType === "weekly" ? weeklyReport : monthlyReport;

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <ScrollView className="flex-1">
        <VStack className="p-6" space="xl">
          <VStack space="md">
            <Heading size="2xl">Reports</Heading>
            <Text className="text-typography-500">
              View your health tracking progress
            </Text>
          </VStack>

          {/* Report Type Selector */}
          <HStack className="w-full" space="sm">
            <Button
              variant={reportType === "weekly" ? "solid" : "outline"}
              action={reportType === "weekly" ? "primary" : "secondary"}
              className="flex-1"
              onPress={() => setReportType("weekly")}
            >
              <ButtonText>Weekly</ButtonText>
            </Button>
            <Button
              variant={reportType === "monthly" ? "solid" : "outline"}
              action={reportType === "monthly" ? "primary" : "secondary"}
              className="flex-1"
              onPress={() => setReportType("monthly")}
            >
              <ButtonText>Monthly</ButtonText>
            </Button>
          </HStack>

          {/* Period Navigation */}
          <HStack className="items-center justify-between">
            <Button
              variant="outline"
              action="secondary"
              onPress={handlePreviousPeriod}
            >
              <ButtonText>← Previous</ButtonText>
            </Button>
            <VStack className="items-center">
              <Icon as={Calendar} size="md" className="text-typography-500" />
              <Text className="font-semibold">{getPeriodLabel()}</Text>
            </VStack>
            <Button
              variant="outline"
              action="secondary"
              onPress={handleNextPeriod}
            >
              <ButtonText>Next →</ButtonText>
            </Button>
          </HStack>

          {isLoading ? (
            <VStack className="items-center justify-center p-8">
              <Text>Loading report...</Text>
            </VStack>
          ) : currentReport ? (
            <VStack space="lg">
              {/* Summary Cards */}
              <HStack space="md">
                <VStack className="flex-1 p-4 bg-primary-50 rounded-xl" space="sm">
                  <HStack className="items-center" space="sm">
                    <Icon as={Droplet} size="md" className="text-primary-600" />
                    <Text className="text-sm text-typography-500">Water</Text>
                  </HStack>
                  <Text className="text-2xl font-bold">
                    {currentReport.totalWaterBottles}
                  </Text>
                  <Text className="text-xs text-typography-400">
                    {currentReport.waterDays} days tracked
                  </Text>
                </VStack>

                <VStack className="flex-1 p-4 bg-secondary-50 rounded-xl" space="sm">
                  <HStack className="items-center" space="sm">
                    <Icon as={Dumbbell} size="md" className="text-secondary-600" />
                    <Text className="text-sm text-typography-500">Workouts</Text>
                  </HStack>
                  <Text className="text-2xl font-bold">
                    {currentReport.totalWorkouts}
                  </Text>
                  <Text className="text-xs text-typography-400">
                    {currentReport.workoutDays} days
                  </Text>
                </VStack>
              </HStack>

              {/* Detailed Stats */}
              <VStack className="p-5 bg-background-50 rounded-xl" space="md">
                <Heading size="md">Statistics</Heading>
                <VStack space="sm">
                  <HStack className="justify-between items-center">
                    <Text>Total Workouts</Text>
                    <Text className="font-semibold">{currentReport.totalWorkouts}</Text>
                  </HStack>
                  <HStack className="justify-between items-center">
                    <Text>Total Water Bottles</Text>
                    <Text className="font-semibold">{currentReport.totalWaterBottles}</Text>
                  </HStack>
                  <HStack className="justify-between items-center">
                    <Text>Workout Days</Text>
                    <Text className="font-semibold">
                      {currentReport.workoutDays} / {reportType === "weekly" ? "7" : "30"} days
                    </Text>
                  </HStack>
                  <HStack className="justify-between items-center">
                    <Text>Water Tracking Days</Text>
                    <Text className="font-semibold">
                      {currentReport.waterDays} / {reportType === "weekly" ? "7" : "30"} days
                    </Text>
                  </HStack>
                  {currentReport.averageWeight && (
                    <HStack className="justify-between items-center">
                      <Text>Average Weight</Text>
                      <Text className="font-semibold">
                        {currentReport.averageWeight.toFixed(1)} kg
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </VStack>

              {/* Goals Comparison */}
              {currentReport.goals && (
                <VStack className="p-5 bg-primary-50 rounded-xl" space="md">
                  <Heading size="md">Goals Progress</Heading>
                  <VStack space="sm">
                    <VStack space="xs">
                      <HStack className="justify-between">
                        <Text>Workout Goal</Text>
                        <Text className="font-semibold">
                          {currentReport.workoutDays} / {currentReport.goals.workoutDaysPerWeek} days
                        </Text>
                      </HStack>
                      <HStack className="w-full h-2 bg-primary-100 rounded-full overflow-hidden">
                        <VStack
                          className="h-full bg-primary-600 rounded-full"
                          style={{
                            width: `${Math.min(
                              (currentReport.workoutDays / currentReport.goals.workoutDaysPerWeek) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </HStack>
                    </VStack>
                    <VStack space="xs">
                      <HStack className="justify-between">
                        <Text>Water Goal</Text>
                        <Text className="font-semibold">
                          {currentReport.totalWaterBottles} /{" "}
                          {currentReport.goals.waterBottlesPerDay *
                            (reportType === "weekly" ? 7 : 30)}{" "}
                          bottles
                        </Text>
                      </HStack>
                      <HStack className="w-full h-2 bg-primary-100 rounded-full overflow-hidden">
                        <VStack
                          className="h-full bg-primary-600 rounded-full"
                          style={{
                            width: `${Math.min(
                              (currentReport.totalWaterBottles /
                                (currentReport.goals.waterBottlesPerDay *
                                  (reportType === "weekly" ? 7 : 30))) *
                                100,
                              100
                            )}%`,
                          }}
                        />
                      </HStack>
                    </VStack>
                  </VStack>
                </VStack>
              )}
            </VStack>
          ) : (
            <VStack className="items-center justify-center p-8">
              <Text className="text-typography-500">No data available</Text>
            </VStack>
          )}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}

