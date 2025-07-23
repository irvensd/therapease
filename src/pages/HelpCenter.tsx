import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Search,
  BookOpen,
  MessageCircle,
  Video,
  FileText,
  ArrowLeft,
  ArrowRight,
  Clock,
  User,
} from "lucide-react";

const HelpCenter = () => {
  const categories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Basic setup and initial configuration",
      articles: 12,
    },
    {
      icon: User,
      title: "Client Management",
      description: "Adding, editing, and managing client profiles",
      articles: 8,
    },
    {
      icon: Clock,
      title: "Scheduling",
      description: "Calendar setup and appointment management",
      articles: 6,
    },
    {
      icon: FileText,
      title: "Clinical Notes",
      description: "Creating and managing session documentation",
      articles: 10,
    },
    {
      icon: MessageCircle,
      title: "Billing & Invoicing",
      description: "Payment processing and invoice management",
      articles: 7,
    },
    {
      icon: Video,
      title: "Troubleshooting",
      description: "Common issues and their solutions",
      articles: 15,
    },
  ];

  const popularArticles = [
    {
      title: "How to set up your first client profile",
      category: "Getting Started",
      readTime: "3 min read",
    },
    {
      title: "Creating and managing session templates",
      category: "Clinical Notes",
      readTime: "5 min read",
    },
    {
      title: "Setting up automated appointment reminders",
      category: "Scheduling",
      readTime: "4 min read",
    },
    {
      title: "Understanding HIPAA compliance features",
      category: "Security",
      readTime: "6 min read",
    },
    {
      title: "Processing payments and generating invoices",
      category: "Billing & Invoicing",
      readTime: "4 min read",
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
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How can we help you?
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers, guides, and resources to get the most out of TherapEase
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for articles, guides, or features..."
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-muted-foreground">
              Find the help you need organized by topic
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {category.articles} articles
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center text-primary hover:text-primary/80">
                    <span className="text-sm font-medium">Browse articles</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular Articles
            </h2>
            <p className="text-xl text-muted-foreground">
              Most viewed help articles and guides
            </p>
          </div>

          <div className="space-y-4">
            {popularArticles.map((article, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 hover:text-primary">
                        {article.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <Badge variant="outline">{article.category}</Badge>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground ml-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Still need help?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our support team is here to help you succeed
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Get instant help from our support team
                </p>
                <Button className="w-full">Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Submit Ticket
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Send us a detailed question or issue
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/contact">Contact Support</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;
