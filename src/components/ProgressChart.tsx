import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  LineChart,
  Target,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressChartProps {
  clientName?: string;
  mode?: "dashboard" | "client" | "overview";
}

type AssessmentData = {
  date: string;
  phq9: number;
  gad7: number;
  sessionCount: number;
  mood: number; // 1-10 scale
  anxiety: number; // 1-10 scale
  sleep: number; // 1-10 scale
  functioning: number; // 1-10 scale
};

type Milestone = {
  date: string;
  title: string;
  type: "achievement" | "goal" | "setback";
  description: string;
};

export function ProgressChart({
  clientName = "Emma Thompson",
  mode = "client",
}: ProgressChartProps) {
  const [timeRange, setTimeRange] = useState("3months");
  const [selectedMetric, setSelectedMetric] = useState("phq9");

  // Mock assessment data showing improvement over time
  const assessmentData: AssessmentData[] = [
    {
      date: "2023-10-01",
      phq9: 18,
      gad7: 16,
      sessionCount: 0,
      mood: 3,
      anxiety: 8,
      sleep: 3,
      functioning: 4,
    },
    {
      date: "2023-10-15",
      phq9: 16,
      gad7: 15,
      sessionCount: 2,
      mood: 4,
      anxiety: 7,
      sleep: 4,
      functioning: 4,
    },
    {
      date: "2023-11-01",
      phq9: 14,
      gad7: 13,
      sessionCount: 4,
      mood: 5,
      anxiety: 6,
      sleep: 5,
      functioning: 5,
    },
    {
      date: "2023-11-15",
      phq9: 11,
      gad7: 11,
      sessionCount: 6,
      mood: 6,
      anxiety: 5,
      sleep: 6,
      functioning: 6,
    },
    {
      date: "2023-12-01",
      phq9: 9,
      gad7: 9,
      sessionCount: 8,
      mood: 7,
      anxiety: 4,
      sleep: 7,
      functioning: 7,
    },
    {
      date: "2023-12-15",
      phq9: 7,
      gad7: 7,
      sessionCount: 10,
      mood: 8,
      anxiety: 3,
      sleep: 8,
      functioning: 8,
    },
    {
      date: "2024-01-01",
      phq9: 6,
      gad7: 6,
      sessionCount: 12,
      mood: 8,
      anxiety: 3,
      sleep: 8,
      functioning: 8,
    },
  ];

  const milestones: Milestone[] = [
    {
      date: "2023-11-01",
      title: "First Month Milestone",
      type: "achievement",
      description: "Completed first month of therapy consistently",
    },
    {
      date: "2023-11-15",
      title: "Anxiety Breakthrough",
      type: "goal",
      description:
        "Successfully used breathing techniques during work presentation",
    },
    {
      date: "2023-12-15",
      title: "Clinical Improvement",
      type: "achievement",
      description: "PHQ-9 score improved from severe to mild depression range",
    },
  ];

  const getMetricData = () => {
    return assessmentData.map((data) => ({
      date: data.date,
      value: data[selectedMetric as keyof AssessmentData] as number,
    }));
  };

  const getMetricInfo = (metric: string) => {
    switch (metric) {
      case "phq9":
        return {
          name: "PHQ-9 Depression",
          range: "0-27",
          interpretation: "Lower is better",
          color: "rgb(239, 68, 68)",
        };
      case "gad7":
        return {
          name: "GAD-7 Anxiety",
          range: "0-21",
          interpretation: "Lower is better",
          color: "rgb(245, 158, 11)",
        };
      case "mood":
        return {
          name: "Self-Reported Mood",
          range: "1-10",
          interpretation: "Higher is better",
          color: "rgb(34, 197, 94)",
        };
      case "anxiety":
        return {
          name: "Daily Anxiety Level",
          range: "1-10",
          interpretation: "Lower is better",
          color: "rgb(168, 85, 247)",
        };
      case "sleep":
        return {
          name: "Sleep Quality",
          range: "1-10",
          interpretation: "Higher is better",
          color: "rgb(59, 130, 246)",
        };
      case "functioning":
        return {
          name: "Daily Functioning",
          range: "1-10",
          interpretation: "Higher is better",
          color: "rgb(6, 182, 212)",
        };
      default:
        return {
          name: "Unknown Metric",
          range: "N/A",
          interpretation: "N/A",
          color: "rgb(107, 114, 128)",
        };
    }
  };

  const calculateImprovement = () => {
    const data = getMetricData();
    if (data.length < 2) return 0;

    const firstValue = data[0].value;
    const lastValue = data[data.length - 1].value;
    const metricInfo = getMetricInfo(selectedMetric);

    if (metricInfo.interpretation === "Lower is better") {
      return ((firstValue - lastValue) / firstValue) * 100;
    } else {
      return ((lastValue - firstValue) / firstValue) * 100;
    }
  };

  const improvement = calculateImprovement();
  const metricInfo = getMetricInfo(selectedMetric);

  // Simple line chart representation using CSS
  const renderChart = () => {
    const data = getMetricData();
    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = Math.min(...data.map((d) => d.value));
    const range = maxValue - minValue || 1;

    return (
      <div className="relative h-40 bg-gradient-to-t from-muted/20 to-transparent rounded-lg p-4">
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-rows-4 border-b border-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-b border-border/20" />
          ))}
        </div>

        {/* Data points and line */}
        <div className="relative h-full flex items-end justify-between">
          {data.map((point, index) => {
            const height = ((point.value - minValue) / range) * 100;
            const isLast = index === data.length - 1;

            return (
              <div key={index} className="flex flex-col items-center">
                {/* Data point */}
                <div
                  className="relative mb-2"
                  style={{ height: `${Math.max(height, 10)}%` }}
                >
                  <div
                    className={cn(
                      "absolute bottom-0 w-3 h-3 rounded-full border-2 border-white shadow-lg",
                      isLast ? "animate-pulse" : "",
                    )}
                    style={{
                      backgroundColor: metricInfo.color,
                      bottom: "100%",
                    }}
                  />
                  <div
                    className="w-1 bg-gradient-to-t from-muted to-transparent"
                    style={{
                      height: `${height}%`,
                      backgroundColor: `${metricInfo.color}20`,
                    }}
                  />
                </div>

                {/* Date label */}
                <span className="text-xs text-muted-foreground transform -rotate-45">
                  {new Date(point.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>

                {/* Value label */}
                <span className="text-xs font-medium mt-1">{point.value}</span>
              </div>
            );
          })}
        </div>

        {/* Trend line overlay */}
        <div className="absolute inset-4 pointer-events-none">
          <svg className="w-full h-full">
            <path
              d={`M ${data
                .map((point, index) => {
                  const x = (index / (data.length - 1)) * 100;
                  const y =
                    100 - ((point.value - minValue) / range) * 100 || 100;
                  return `${index === 0 ? "M" : "L"} ${x}% ${y}%`;
                })
                .join(" ")}`}
              stroke={metricInfo.color}
              strokeWidth="2"
              fill="none"
              className="drop-shadow-sm"
            />
          </svg>
        </div>
      </div>
    );
  };

  if (mode === "dashboard") {
    return (
      <Card className="therapease-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Progress Overview
            <Badge variant="secondary" className="ml-auto">
              3 clients improving
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
              <div>
                <p className="font-medium text-sm">Emma Thompson</p>
                <p className="text-xs text-muted-foreground">
                  PHQ-9: 18 → 6 (67% improvement)
                </p>
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div>
                <p className="font-medium text-sm">Michael Chen</p>
                <p className="text-xs text-muted-foreground">
                  GAD-7: 15 → 8 (47% improvement)
                </p>
              </div>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200">
              <div>
                <p className="font-medium text-sm">Sarah Johnson</p>
                <p className="text-xs text-muted-foreground">
                  Sleep Quality: 4 → 8 (100% improvement)
                </p>
              </div>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Progress Tracking</h3>
          <p className="text-sm text-muted-foreground">
            Visual tracking of {clientName}'s therapeutic outcomes
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="phq9">PHQ-9 Depression</SelectItem>
              <SelectItem value="gad7">GAD-7 Anxiety</SelectItem>
              <SelectItem value="mood">Self-Reported Mood</SelectItem>
              <SelectItem value="anxiety">Daily Anxiety</SelectItem>
              <SelectItem value="sleep">Sleep Quality</SelectItem>
              <SelectItem value="functioning">Daily Functioning</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Chart */}
      <Card className="therapease-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3
                  className="h-5 w-5"
                  style={{ color: metricInfo.color }}
                />
                {metricInfo.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Range: {metricInfo.range} • {metricInfo.interpretation}
              </p>
            </div>
            <div className="text-right">
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  improvement > 0 ? "text-green-600" : "text-red-600",
                )}
              >
                {improvement > 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {Math.abs(improvement).toFixed(1)}% change
              </div>
              <p className="text-xs text-muted-foreground">vs. baseline</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>{renderChart()}</CardContent>
      </Card>

      {/* Milestones & Achievements */}
      <Card className="therapease-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Milestones & Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
              >
                <div
                  className={cn(
                    "p-1.5 rounded-full",
                    milestone.type === "achievement"
                      ? "bg-green-100 text-green-600"
                      : milestone.type === "goal"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-yellow-100 text-yellow-600",
                  )}
                >
                  {milestone.type === "achievement" ? (
                    <Award className="h-3 w-3" />
                  ) : milestone.type === "goal" ? (
                    <Target className="h-3 w-3" />
                  ) : (
                    <Calendar className="h-3 w-3" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{milestone.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(milestone.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="therapease-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">67%</div>
            <div className="text-sm text-muted-foreground">
              Overall Improvement
            </div>
          </CardContent>
        </Card>
        <Card className="therapease-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-muted-foreground">
              Sessions Completed
            </div>
          </CardContent>
        </Card>
        <Card className="therapease-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-sm text-muted-foreground">
              Milestones Reached
            </div>
          </CardContent>
        </Card>
        <Card className="therapease-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">94%</div>
            <div className="text-sm text-muted-foreground">Attendance Rate</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
