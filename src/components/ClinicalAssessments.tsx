import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClipboardList,
  Brain,
  Heart,
  Activity,
  TrendingUp,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ClinicalAssessmentsProps {
  mode?: "dashboard" | "client" | "standalone";
  clientName?: string;
}

type Assessment = {
  id: string;
  name: string;
  acronym: string;
  description: string;
  category: "depression" | "anxiety" | "trauma" | "general" | "substance";
  questions: number;
  timeEstimate: string;
  icon: any;
  color: string;
  reliability: string;
  validity: string;
  scoringInfo: {
    scale: string;
    ranges: { range: string; description: string; color: string }[];
  };
};

type AssessmentResult = {
  id: string;
  assessmentId: string;
  clientName: string;
  date: string;
  score: number;
  severity: string;
  interpretation: string;
  recommendations: string[];
  previousScore?: number;
  change?: string;
};

export function ClinicalAssessments({
  mode = "dashboard",
  clientName = "Emma Thompson",
}: ClinicalAssessmentsProps) {
  const [selectedAssessment, setSelectedAssessment] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [isCompleting, setIsCompleting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const assessments: Assessment[] = [
    {
      id: "phq9",
      name: "Patient Health Questionnaire-9",
      acronym: "PHQ-9",
      description:
        "Depression screening and severity assessment tool with high reliability",
      category: "depression",
      questions: 9,
      timeEstimate: "3-5 minutes",
      icon: Brain,
      color: "rgb(239, 68, 68)",
      reliability: "α = 0.89",
      validity: "Sensitivity: 88%",
      scoringInfo: {
        scale: "0-27",
        ranges: [
          {
            range: "0-4",
            description: "Minimal depression",
            color: "text-green-600",
          },
          {
            range: "5-9",
            description: "Mild depression",
            color: "text-yellow-600",
          },
          {
            range: "10-14",
            description: "Moderate depression",
            color: "text-orange-600",
          },
          {
            range: "15-19",
            description: "Moderately severe depression",
            color: "text-red-600",
          },
          {
            range: "20-27",
            description: "Severe depression",
            color: "text-red-800",
          },
        ],
      },
    },
    {
      id: "gad7",
      name: "Generalized Anxiety Disorder-7",
      acronym: "GAD-7",
      description: "Anxiety screening tool with excellent internal consistency",
      category: "anxiety",
      questions: 7,
      timeEstimate: "2-3 minutes",
      icon: Heart,
      color: "rgb(245, 158, 11)",
      reliability: "α = 0.92",
      validity: "Sensitivity: 89%",
      scoringInfo: {
        scale: "0-21",
        ranges: [
          {
            range: "0-4",
            description: "Minimal anxiety",
            color: "text-green-600",
          },
          {
            range: "5-9",
            description: "Mild anxiety",
            color: "text-yellow-600",
          },
          {
            range: "10-14",
            description: "Moderate anxiety",
            color: "text-orange-600",
          },
          {
            range: "15-21",
            description: "Severe anxiety",
            color: "text-red-600",
          },
        ],
      },
    },
    {
      id: "pcl5",
      name: "PTSD Checklist for DSM-5",
      acronym: "PCL-5",
      description: "Gold standard for PTSD symptom assessment",
      category: "trauma",
      questions: 20,
      timeEstimate: "5-10 minutes",
      icon: Activity,
      color: "rgb(168, 85, 247)",
      reliability: "α = 0.96",
      validity: "Cut-off: 33",
      scoringInfo: {
        scale: "0-80",
        ranges: [
          {
            range: "0-32",
            description: "Below PTSD threshold",
            color: "text-green-600",
          },
          {
            range: "33-80",
            description: "Probable PTSD",
            color: "text-red-600",
          },
        ],
      },
    },
    {
      id: "dass21",
      name: "Depression Anxiety Stress Scales-21",
      acronym: "DASS-21",
      description: "Comprehensive assessment of emotional distress",
      category: "general",
      questions: 21,
      timeEstimate: "5-7 minutes",
      icon: BarChart3,
      color: "rgb(59, 130, 246)",
      reliability: "α > 0.90",
      validity: "Well-validated",
      scoringInfo: {
        scale: "0-63 (per subscale)",
        ranges: [
          { range: "0-9", description: "Normal", color: "text-green-600" },
          { range: "10-13", description: "Mild", color: "text-yellow-600" },
          { range: "14-20", description: "Moderate", color: "text-orange-600" },
          { range: "21-27", description: "Severe", color: "text-red-600" },
          {
            range: "28+",
            description: "Extremely severe",
            color: "text-red-800",
          },
        ],
      },
    },
  ];

  // Mock PHQ-9 questions for demonstration
  const phq9Questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading the newspaper or watching television",
    "Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
    "Thoughts that you would be better off dead, or of hurting yourself",
  ];

  const responseOptions = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" },
    { value: 3, label: "Nearly every day" },
  ];

  // Mock recent assessment results
  const recentResults: AssessmentResult[] = [
    {
      id: "1",
      assessmentId: "phq9",
      clientName: "Emma Thompson",
      date: "2024-01-15",
      score: 6,
      severity: "Mild depression",
      interpretation:
        "Score indicates mild depression symptoms. Monitor progress and consider therapeutic interventions.",
      recommendations: [
        "Continue weekly therapy sessions",
        "Monitor sleep patterns",
        "Consider behavioral activation techniques",
      ],
      previousScore: 14,
      change: "57% improvement",
    },
    {
      id: "2",
      assessmentId: "gad7",
      clientName: "Michael Chen",
      date: "2024-01-12",
      score: 8,
      severity: "Mild anxiety",
      interpretation:
        "Mild anxiety symptoms present. Significant improvement from baseline.",
      recommendations: [
        "Practice relaxation techniques",
        "Continue CBT interventions",
        "Monitor anxiety triggers",
      ],
      previousScore: 15,
      change: "47% improvement",
    },
  ];

  const calculateScore = () => {
    return Object.values(responses).reduce((sum, value) => sum + value, 0);
  };

  const interpretScore = (score: number, assessmentId: string) => {
    const assessment = assessments.find((a) => a.id === assessmentId);
    if (!assessment) return { severity: "Unknown", color: "text-gray-600" };

    for (const range of assessment.scoringInfo.ranges) {
      const [min, max] = range.range.split("-").map((n) => parseInt(n) || 999);
      if (score >= min && score <= max) {
        return { severity: range.description, color: range.color };
      }
    }
    return { severity: "Unknown", color: "text-gray-600" };
  };

  const completeAssessment = () => {
    const score = calculateScore();
    const interpretation = interpretScore(score, selectedAssessment);

    console.log("Assessment completed:", {
      assessment: selectedAssessment,
      score,
      interpretation,
      responses,
    });

    setShowResults(true);
    setIsCompleting(false);
    setCurrentQuestionIndex(0);
    setResponses({});
  };

  if (mode === "dashboard") {
    return (
      <Card className="therapease-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-blue-600" />
            Clinical Assessments
            <Badge variant="secondary" className="ml-auto">
              4 tools available
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick assessment overview */}
          <div className="grid grid-cols-2 gap-3">
            {assessments.slice(0, 4).map((assessment) => {
              const IconComponent = assessment.icon;
              return (
                <div
                  key={assessment.id}
                  className="p-3 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="p-1.5 rounded"
                      style={{ backgroundColor: `${assessment.color}20` }}
                    >
                      <IconComponent
                        className="h-3 w-3"
                        style={{ color: assessment.color }}
                      />
                    </div>
                    <span className="text-xs font-medium">
                      {assessment.acronym}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {assessment.timeEstimate}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Recent results summary */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Results</h4>
            {recentResults.slice(0, 2).map((result) => {
              const assessment = assessments.find(
                (a) => a.id === result.assessmentId,
              );
              const interpretation = interpretScore(
                result.score,
                result.assessmentId,
              );

              return (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-2 rounded bg-muted/30"
                >
                  <div>
                    <p className="text-xs font-medium">
                      {result.clientName} • {assessment?.acronym}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Score: {result.score} •{" "}
                      <span className={interpretation.color}>
                        {interpretation.severity}
                      </span>
                    </p>
                  </div>
                  {result.change && (
                    <Badge variant="outline" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {result.change}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <ClipboardList className="h-4 w-4 mr-2" />
                Administer Assessment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Clinical Assessment Tools</DialogTitle>
              </DialogHeader>

              {!isCompleting && !showResults && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="client">Select Client</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emma">Emma Thompson</SelectItem>
                        <SelectItem value="michael">Michael Chen</SelectItem>
                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Choose Assessment Tool</Label>
                    <div className="grid gap-3 mt-2">
                      {assessments.map((assessment) => {
                        const IconComponent = assessment.icon;
                        return (
                          <Card
                            key={assessment.id}
                            className={cn(
                              "cursor-pointer transition-colors",
                              selectedAssessment === assessment.id
                                ? "ring-2 ring-primary"
                                : "hover:bg-muted/50",
                            )}
                            onClick={() => setSelectedAssessment(assessment.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div
                                  className="p-2 rounded-lg"
                                  style={{
                                    backgroundColor: `${assessment.color}20`,
                                  }}
                                >
                                  <IconComponent
                                    className="h-4 w-4"
                                    style={{ color: assessment.color }}
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-sm">
                                      {assessment.name}
                                    </h4>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {assessment.acronym}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-2">
                                    {assessment.description}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span>
                                      {assessment.questions} questions
                                    </span>
                                    <span>{assessment.timeEstimate}</span>
                                    <span>{assessment.reliability}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsCompleting(true)}
                    disabled={!selectedAssessment}
                    className="w-full"
                  >
                    Begin Assessment
                  </Button>
                </div>
              )}

              {isCompleting && selectedAssessment === "phq9" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">PHQ-9 Assessment</h3>
                    <Badge variant="outline">
                      {currentQuestionIndex + 1} of {phq9Questions.length}
                    </Badge>
                  </div>

                  <Progress
                    value={
                      ((currentQuestionIndex + 1) / phq9Questions.length) * 100
                    }
                    className="h-2"
                  />

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-4">
                        Over the last 2 weeks, how often have you been bothered
                        by:
                      </h4>
                      <p className="text-lg mb-6">
                        {phq9Questions[currentQuestionIndex]}
                      </p>

                      <RadioGroup
                        value={responses[currentQuestionIndex]?.toString()}
                        onValueChange={(value) =>
                          setResponses({
                            ...responses,
                            [currentQuestionIndex]: parseInt(value),
                          })
                        }
                      >
                        {responseOptions.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={option.value.toString()}
                              id={option.value.toString()}
                            />
                            <Label htmlFor={option.value.toString()}>
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentQuestionIndex(
                          Math.max(0, currentQuestionIndex - 1),
                        )
                      }
                      disabled={currentQuestionIndex === 0}
                    >
                      Previous
                    </Button>

                    {currentQuestionIndex === phq9Questions.length - 1 ? (
                      <Button
                        onClick={completeAssessment}
                        disabled={responses[currentQuestionIndex] === undefined}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Assessment
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          setCurrentQuestionIndex(currentQuestionIndex + 1)
                        }
                        disabled={responses[currentQuestionIndex] === undefined}
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {showResults && (
                <div className="space-y-4">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Assessment Complete
                    </h3>
                    <p className="text-muted-foreground">
                      Results have been recorded for {clientName}
                    </p>
                  </div>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold mb-2">
                        {calculateScore()}
                      </div>
                      <p className="text-muted-foreground mb-4">PHQ-9 Score</p>
                      <Badge
                        className={
                          interpretScore(calculateScore(), "phq9").color
                        }
                      >
                        {interpretScore(calculateScore(), "phq9").severity}
                      </Badge>
                    </CardContent>
                  </Card>

                  <div className="space-y-2">
                    <h4 className="font-medium">Clinical Recommendations:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Continue weekly therapy sessions</li>
                      <li>• Monitor sleep and appetite patterns</li>
                      <li>• Consider behavioral activation techniques</li>
                      <li>• Schedule follow-up assessment in 4 weeks</li>
                    </ul>
                  </div>

                  <Button
                    onClick={() => {
                      setShowResults(false);
                      setSelectedAssessment("");
                    }}
                    className="w-full"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Save to Client Record
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return null;
}
