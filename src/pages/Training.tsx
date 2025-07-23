import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Play,
  BookOpen,
  Users,
  Clock,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Award,
} from "lucide-react";

const Training = () => {
  const trainingPrograms = [
    {
      title: "Quick Start Training",
      duration: "2 hours",
      format: "Live Session",
      level: "Beginner",
      description:
        "Get up and running with TherapEase basics in just 2 hours. Perfect for new users.",
      topics: [
        "Account setup and configuration",
        "Creating your first client profile",
        "Basic scheduling and calendar management",
        "Essential features walkthrough",
      ],
    },
    {
      title: "Advanced Practice Management",
      duration: "4 hours",
      format: "Self-Paced",
      level: "Intermediate",
      description:
        "Deep dive into advanced features for optimizing your practice workflow.",
      topics: [
        "Advanced client management techniques",
        "Custom templates and automation",
        "Reporting and analytics",
        "Integration with third-party tools",
      ],
    },
    {
      title: "HIPAA Compliance & Security",
      duration: "1.5 hours",
      format: "Live Session",
      level: "All Levels",
      description:
        "Understanding security features and maintaining HIPAA compliance.",
      topics: [
        "HIPAA requirements overview",
        "Security best practices",
        "Data protection features",
        "Audit trails and compliance reporting",
      ],
    },
  ];

  const resources = [
    {
      icon: BookOpen,
      title: "Video Library",
      description: "Comprehensive video tutorials covering all features",
      count: "50+ videos",
    },
    {
      icon: Users,
      title: "Webinars",
      description: "Monthly live sessions with expert tips and Q&A",
      count: "Weekly",
    },
    {
      icon: Award,
      title: "Certification",
      description: "Get certified as a TherapEase power user",
      count: "Available",
    },
    {
      icon: Calendar,
      title: "One-on-One Sessions",
      description: "Personalized training with our experts",
      count: "By appointment",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              TherapEase
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Award className="mr-2 h-4 w-4" />
              Professional Training
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Master TherapEase with Expert Training
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive training programs designed to help you maximize your
              practice efficiency and get the most out of TherapEase.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                10,000+
              </div>
              <div className="text-muted-foreground">Trained Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Support Access</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Video Tutorials</div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Training Programs
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the training path that fits your needs and schedule
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {trainingPrograms.map((program, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{program.level}</Badge>
                    <Badge variant="secondary">{program.format}</Badge>
                  </div>
                  <CardTitle className="text-xl">{program.title}</CardTitle>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    {program.duration}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {program.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold">What you'll learn:</h4>
                    <ul className="space-y-1">
                      {program.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-start">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            {topic}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Start Training
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Training Resources */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Learning Resources
            </h2>
            <p className="text-xl text-muted-foreground">
              Access a wealth of training materials and support options
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resources.map((resource, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto">
                    <resource.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>{resource.title}</CardTitle>
                  <Badge variant="secondary">{resource.count}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {resource.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding Process */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Learning Journey
            </h2>
            <p className="text-xl text-muted-foreground">
              We'll guide you every step of the way
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Welcome & Assessment
                </h3>
                <p className="text-muted-foreground">
                  We start with a brief assessment to understand your current
                  knowledge and create a personalized learning path.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Foundation Training
                </h3>
                <p className="text-muted-foreground">
                  Master the essentials with our quick start program and get
                  your practice up and running immediately.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Advanced Features
                </h3>
                <p className="text-muted-foreground">
                  Dive deeper into advanced functionality to optimize your
                  workflow and maximize efficiency.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Ongoing Support</h3>
                <p className="text-muted-foreground">
                  Continue learning with our resource library, webinars, and
                  dedicated support team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of therapists who have transformed their practice
            with expert TherapEase training.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="text-lg px-8"
            >
              <Link to="/contact">Schedule Training</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Training;
