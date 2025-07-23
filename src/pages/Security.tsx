import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Shield,
  Lock,
  Database,
  Eye,
  FileCheck,
  Users,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

const Security = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: "HIPAA Compliance",
      description:
        "Full HIPAA compliance with administrative, physical, and technical safeguards to protect patient health information.",
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description:
        "All data is encrypted in transit and at rest using AES-256 encryption, ensuring maximum security.",
    },
    {
      icon: Database,
      title: "Secure Data Storage",
      description:
        "Data centers with SOC 2 Type II certification and 24/7 monitoring for optimal security.",
    },
    {
      icon: Eye,
      title: "Access Controls",
      description:
        "Role-based access controls and multi-factor authentication to prevent unauthorized access.",
    },
    {
      icon: FileCheck,
      title: "Audit Trails",
      description:
        "Comprehensive logging and audit trails for all system activities and data access.",
    },
    {
      icon: Users,
      title: "Staff Training",
      description:
        "Regular security training and background checks for all personnel with data access.",
    },
  ];

  const certifications = [
    "HIPAA Compliant",
    "SOC 2 Type II",
    "ISO 27001",
    "PCI DSS Level 1",
    "GDPR Compliant",
    "HITECH Compliant",
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
              <Shield className="mr-2 h-4 w-4" />
              Enterprise-Grade Security
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Data Security is Our Priority
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              TherapEase employs industry-leading security measures to protect
              your practice and client data with enterprise-grade protection.
            </p>
          </div>

          {/* Certifications */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {certifications.map((cert, index) => (
              <Badge key={index} variant="outline" className="px-4 py-2">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                {cert}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Security Framework
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Multi-layered security architecture designed specifically for
              healthcare and therapy practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Protection */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Data Protection & Privacy
            </h2>
            <p className="text-xl text-muted-foreground">
              Your client data is protected with the highest security standards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Data Encryption</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  AES-256 encryption for data at rest
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  TLS 1.3 encryption for data in transit
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Encrypted database backups
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Key management with HSM
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Access Control</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Multi-factor authentication
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Role-based permissions
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Session timeout controls
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  IP address restrictions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for Secure Practice Management?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the peace of mind that comes with enterprise-grade
            security for your therapy practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/signup">Start Free Trial</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="text-lg px-8"
            >
              <Link to="/contact">Contact Security Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Security;
