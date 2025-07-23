import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  Shield,
  Lock,
  Eye,
  ArrowLeft,
  Calendar,
} from "lucide-react";

const Privacy = () => {
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

      {/* Content */}
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <div className="flex items-center text-muted-foreground mb-6">
            <Calendar className="mr-2 h-4 w-4" />
            Last updated: December 1, 2024
          </div>
          <p className="text-xl text-muted-foreground">
            At TherapEase, we take your privacy seriously. This policy explains how we
            collect, use, and protect your personal information.
          </p>
        </div>

        <div className="space-y-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>We collect information you provide directly to us, such as:</p>
              <ul>
                <li>Account information (name, email, professional credentials)</li>
                <li>Practice information (business name, address, phone number)</li>
                <li>Client data you enter into our system</li>
                <li>Payment and billing information</li>
                <li>Communications with our support team</li>
              </ul>
              
              <p>We also automatically collect certain information:</p>
              <ul>
                <li>Device and browser information</li>
                <li>IP address and location data</li>
                <li>Usage patterns and feature interactions</li>
                <li>Log files and system performance data</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5 text-primary" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide and maintain our services</li>
                <li>Process transactions and send billing notices</li>
                <li>Respond to your questions and provide customer support</li>
                <li>Send important service updates and security notices</li>
                <li>Improve our platform and develop new features</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
              
              <p>
                <strong>We do not sell your personal information to third parties.</strong> 
                We may share your information only in limited circumstances outlined 
                in this policy.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5 text-primary" />
                HIPAA Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                TherapEase is fully HIPAA compliant. When you use our platform to 
                store Protected Health Information (PHI):
              </p>
              <ul>
                <li>All PHI is encrypted at rest and in transit</li>
                <li>Access controls ensure only authorized users can view data</li>
                <li>We maintain detailed audit logs of all system access</li>
                <li>Regular security assessments and penetration testing</li>
                <li>Business Associate Agreements available upon request</li>
                <li>Incident response procedures for any security events</li>
              </ul>
              
              <p>
                You retain full control over your client data and can export or 
                delete it at any time.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>We implement industry-leading security measures:</p>
              <ul>
                <li>AES-256 encryption for data at rest</li>
                <li>TLS 1.3 encryption for data in transit</li>
                <li>Multi-factor authentication options</li>
                <li>Regular security audits and compliance assessments</li>
                <li>SOC 2 Type II certified data centers</li>
                <li>24/7 security monitoring and incident response</li>
                <li>Regular employee security training</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>We may share your information in these limited circumstances:</p>
              <ul>
                <li>
                  <strong>Service Providers:</strong> With trusted third-party 
                  vendors who help us operate our platform (all under strict 
                  confidentiality agreements)
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law, 
                  regulation, or court order
                </li>
                <li>
                  <strong>Safety:</strong> To protect the safety of our users 
                  or the public
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a 
                  merger, acquisition, or sale of assets (with advance notice)
                </li>
              </ul>
              
              <p>
                We never share PHI without proper authorization and Business 
                Associate Agreements in place.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>You have the right to:</p>
              <ul>
                <li>Access and review your personal information</li>
                <li>Correct or update your information</li>
                <li>Delete your account and associated data</li>
                <li>Export your data in a portable format</li>
                <li>Opt out of non-essential communications</li>
                <li>Request information about how your data is used</li>
              </ul>
              
              <p>
                To exercise these rights, contact us at privacy@therapease.com 
                or through your account settings.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>We retain your information for as long as:</p>
              <ul>
                <li>Your account is active</li>
                <li>Needed to provide you services</li>
                <li>Required to comply with legal obligations</li>
                <li>Necessary to resolve disputes and enforce agreements</li>
              </ul>
              
              <p>
                When you delete your account, we will delete your personal 
                information within 30 days, except where retention is required 
                by law.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Your information may be transferred to and processed in countries 
                other than your own. We ensure appropriate safeguards are in place:
              </p>
              <ul>
                <li>Standard Contractual Clauses for EU data</li>
                <li>Adequacy decisions where applicable</li>
                <li>Other lawful transfer mechanisms as required</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                We may update this privacy policy from time to time. We will 
                notify you of any material changes by:
              </p>
              <ul>
                <li>Posting the updated policy on our website</li>
                <li>Sending you an email notification</li>
                <li>Displaying a notice in your account dashboard</li>
              </ul>
              
              <p>
                Your continued use of our services after any changes indicates 
                your acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                If you have questions about this privacy policy or our privacy 
                practices, please contact us:
              </p>
              <ul>
                <li>Email: privacy@therapease.com</li>
                <li>Phone: 1-800-THERAPY</li>
                <li>Mail: TherapEase Privacy Office<br />
                    123 Healthcare Blvd, Suite 456<br />
                    San Francisco, CA 94102
                </li>
              </ul>
              
              <p>
                For HIPAA-related inquiries, please contact our HIPAA Security 
                Officer at hipaa@therapease.com.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
