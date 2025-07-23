import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Users,
  Target,
  Award,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Building,
} from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Compassion First",
      description:
        "We believe in putting therapists and their clients at the center of everything we do.",
    },
    {
      icon: Target,
      title: "Purpose-Driven",
      description:
        "Our mission is to empower mental health professionals to make a greater impact.",
    },
    {
      icon: Users,
      title: "Community Focus",
      description:
        "We build tools that strengthen the mental health community and improve care delivery.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We strive for the highest standards in security, usability, and reliability.",
    },
  ];

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "CEO & Co-Founder",
      background: "Clinical Psychologist",
      image: "/api/placeholder/150/150",
      bio: "15+ years in private practice, passionate about improving therapist workflows.",
    },
    {
      name: "Michael Rodriguez",
      role: "CTO & Co-Founder",
      background: "Healthcare Technology",
      image: "/api/placeholder/150/150",
      bio: "Former healthcare IT executive with expertise in HIPAA-compliant systems.",
    },
    {
      name: "Dr. Emily Johnson",
      role: "Head of Clinical Affairs",
      background: "Marriage & Family Therapy",
      image: "/api/placeholder/150/150",
      bio: "Licensed therapist and advocate for evidence-based practice management.",
    },
    {
      name: "David Kim",
      role: "Head of Security",
      background: "Cybersecurity Expert",
      image: "/api/placeholder/150/150",
      bio: "20+ years securing healthcare data and ensuring regulatory compliance.",
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description:
        "Started with a vision to simplify therapy practice management",
    },
    {
      year: "2021",
      title: "First 1,000 Users",
      description:
        "Reached our first milestone with therapists across 20 states",
    },
    {
      year: "2022",
      title: "HIPAA Certification",
      description:
        "Achieved full HIPAA compliance and SOC 2 Type II certification",
    },
    {
      year: "2023",
      title: "10,000+ Practices",
      description: "Serving over 10,000 mental health professionals worldwide",
    },
    {
      year: "2024",
      title: "AI Integration",
      description: "Launched AI-powered features to enhance clinical workflows",
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
              <Building className="mr-2 h-4 w-4" />
              Our Story
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Empowering Mental Health Professionals
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to help therapists focus on what they do best -
              helping clients heal and grow - by providing the best practice
              management tools in the industry.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Mission</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            To revolutionize therapy practice management by creating intuitive,
            secure, and comprehensive tools that reduce administrative burden
            and enhance the therapeutic relationship between practitioners and
            their clients.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                10,000+
              </div>
              <div className="text-muted-foreground">Therapists Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50M+</div>
              <div className="text-muted-foreground">Sessions Managed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl text-muted-foreground">
              Experienced professionals dedicated to improving mental healthcare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardHeader>
                  <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-primary font-medium">{member.role}</p>
                  <Badge variant="outline">{member.background}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground">
              Key milestones in our mission to transform therapy practice
              management
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  {milestone.year}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Mission
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're always looking for passionate individuals who want to make a
            difference in mental healthcare. Come help us build the future of
            therapy practice management.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              <Briefcase className="mr-2 h-5 w-5" />
              View Open Positions
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="text-lg px-8"
            >
              <Link to="/contact">
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Recognition</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Trusted by industry leaders and recognized for excellence
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <Award className="h-12 w-12 text-primary mb-3" />
              <p className="font-semibold">Best Healthcare Software</p>
              <p className="text-sm text-muted-foreground">
                TechHealth Awards 2024
              </p>
            </div>
            <div className="flex flex-col items-center">
              <GraduationCap className="h-12 w-12 text-primary mb-3" />
              <p className="font-semibold">Innovation in Mental Health</p>
              <p className="text-sm text-muted-foreground">
                MH Tech Summit 2023
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-primary mb-3" />
              <p className="font-semibold">Customer Choice Award</p>
              <p className="text-sm text-muted-foreground">
                Practice Management 2023
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Building className="h-12 w-12 text-primary mb-3" />
              <p className="font-semibold">Best Startup</p>
              <p className="text-sm text-muted-foreground">
                Healthcare Innovation 2022
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
