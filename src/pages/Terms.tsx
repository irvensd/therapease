import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  FileText,
  Scale,
  AlertTriangle,
  ArrowLeft,
  Calendar,
} from "lucide-react";

const Terms = () => {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <div className="flex items-center text-muted-foreground mb-6">
            <Calendar className="mr-2 h-4 w-4" />
            Last updated: December 1, 2024
          </div>
          <p className="text-xl text-muted-foreground">
            These terms govern your use of TherapEase and our practice management services.
            Please read them carefully.
          </p>
        </div>

        <div className="space-y-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                By accessing or using TherapEase services, you agree to be bound by 
                these Terms of Service and our Privacy Policy. If you do not agree 
                to these terms, you may not use our services.
              </p>
              
              <p>
                These terms apply to all users of our platform, including therapists, 
                practice administrators, and any authorized users of your account.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Service Description</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                TherapEase provides a cloud-based practice management platform 
                specifically designed for mental health professionals. Our services include:
              </p>
              <ul>
                <li>Client management and record keeping</li>
                <li>Appointment scheduling and calendar management</li>
                <li>Clinical note documentation</li>
                <li>Billing and invoicing tools</li>
                <li>Progress tracking and reporting</li>
                <li>Secure communication features</li>
              </ul>
              
              <p>
                We reserve the right to modify, suspend, or discontinue any aspect 
                of our services at any time with reasonable notice.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>User Accounts and Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>To use our services, you must:</p>
              <ul>
                <li>Be a licensed mental health professional or authorized staff member</li>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Be responsible for all activities that occur under your account</li>
              </ul>
              
              <p>
                You are solely responsible for ensuring that your use of our platform 
                complies with all applicable laws, regulations, and professional 
                standards in your jurisdiction.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="mr-2 h-5 w-5 text-primary" />
                Professional Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                As a healthcare technology platform, you acknowledge that:
              </p>
              <ul>
                <li>
                  You are responsible for maintaining all required professional 
                  licenses and certifications
                </li>
                <li>
                  You must comply with HIPAA, state privacy laws, and other 
                  applicable regulations
                </li>
                <li>
                  You are responsible for obtaining appropriate client consent 
                  for electronic record keeping
                </li>
                <li>
                  Clinical decisions and treatments remain solely your responsibility
                </li>
                <li>
                  Our platform does not provide medical or therapeutic advice
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Data Ownership and Security</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                <strong>Your Data:</strong> You retain ownership of all client data 
                and practice information you input into our system. We act as a 
                data processor on your behalf.
              </p>
              
              <p>
                <strong>Our Responsibilities:</strong>
              </p>
              <ul>
                <li>Maintain HIPAA-compliant security measures</li>
                <li>Provide secure data storage and transmission</li>
                <li>Implement access controls and audit logging</li>
                <li>Offer data export capabilities</li>
                <li>Maintain regular security assessments</li>
              </ul>
              
              <p>
                <strong>Your Responsibilities:</strong>
              </p>
              <ul>
                <li>Use strong passwords and enable multi-factor authentication</li>
                <li>Limit access to authorized personnel only</li>
                <li>Report any suspected security incidents immediately</li>
                <li>Maintain current contact information for security notices</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                <strong>Subscription Fees:</strong> Our services are provided on a 
                subscription basis. Fees are billed in advance based on your 
                selected plan.
              </p>
              
              <p>
                <strong>Payment Terms:</strong>
              </p>
              <ul>
                <li>Payments are due on the billing date specified in your account</li>
                <li>Late payments may result in service suspension</li>
                <li>All fees are non-refundable except as required by law</li>
                <li>We may change our pricing with 30 days' notice</li>
                <li>Taxes are your responsibility unless otherwise stated</li>
              </ul>
              
              <p>
                <strong>Free Trials:</strong> Free trial periods are available for 
                new accounts. Trials automatically convert to paid subscriptions 
                unless cancelled before the trial period ends.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Acceptable Use</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>You agree not to use our services to:</p>
              <ul>
                <li>Violate any laws or regulations</li>
                <li>Infringe on others' intellectual property rights</li>
                <li>Upload malicious software or harmful content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with other users' access to our services</li>
                <li>Use our platform for purposes other than practice management</li>
                <li>Share your account credentials with unauthorized persons</li>
              </ul>
              
              <p>
                Violation of these terms may result in account suspension or 
                termination without refund.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Service Availability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                We strive to maintain 99.9% uptime for our services. However, 
                we cannot guarantee uninterrupted access due to:
              </p>
              <ul>
                <li>Scheduled maintenance (with advance notice)</li>
                <li>Emergency maintenance or security updates</li>
                <li>Third-party service provider issues</li>
                <li>Force majeure events beyond our control</li>
              </ul>
              
              <p>
                We recommend maintaining backup procedures for critical practice 
                operations and data.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                <strong>Service Limitations:</strong> Our platform is provided "as is" 
                without warranties of any kind. We do not guarantee that our services 
                will meet all your requirements or be error-free.
              </p>
              
              <p>
                <strong>Liability Limits:</strong> To the maximum extent permitted by law, 
                our total liability for any claims related to our services shall not 
                exceed the amount you paid us in the 12 months preceding the claim.
              </p>
              
              <p>
                <strong>Exclusions:</strong> We are not liable for:
              </p>
              <ul>
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Actions or omissions of third-party service providers</li>
                <li>Your failure to maintain data backups</li>
                <li>Clinical decisions or treatment outcomes</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                <strong>By You:</strong> You may cancel your subscription at any time 
                through your account settings. Cancellation takes effect at the end 
                of your current billing period.
              </p>
              
              <p>
                <strong>By Us:</strong> We may suspend or terminate your account for:
              </p>
              <ul>
                <li>Non-payment of fees</li>
                <li>Violation of these terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Extended inactivity (with notice)</li>
              </ul>
              
              <p>
                <strong>Data Export:</strong> Upon termination, you have 30 days to 
                export your data. After this period, your data will be permanently 
                deleted in accordance with our retention policy.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                These terms are governed by the laws of the State of California, 
                without regard to conflict of law principles. Any disputes shall 
                be resolved through binding arbitration in San Francisco, California.
              </p>
              
              <p>
                If any provision of these terms is found to be unenforceable, 
                the remaining provisions will continue in full force and effect.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                We may update these terms from time to time to reflect changes 
                in our services or legal requirements. We will notify you of 
                material changes by:
              </p>
              <ul>
                <li>Posting updated terms on our website</li>
                <li>Sending email notification to your registered address</li>
                <li>Displaying a notice in your account dashboard</li>
              </ul>
              
              <p>
                Your continued use of our services after changes take effect 
                constitutes acceptance of the updated terms.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                If you have questions about these terms or need to report 
                violations, please contact us:
              </p>
              <ul>
                <li>Email: legal@therapease.com</li>
                <li>Phone: 1-800-THERAPY</li>
                <li>Mail: TherapEase Legal Department<br />
                    123 Healthcare Blvd, Suite 456<br />
                    San Francisco, CA 94102
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;
