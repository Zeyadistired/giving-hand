"use client"
import {
  ArrowLeft,
  Shield,
  FileText,
  UserCheck,
  AlertTriangle,
  Copyright,
  XCircle,
  Scale,
  RefreshCw,
  CheckCircle2,
  AlertOctagon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"

const BackButton = () => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="mr-2"
      onClick={() => navigate(-1)}
    >
      <ArrowLeft className="h-5 w-5" />
      <span className="sr-only">Go back</span>
    </Button>
  )
}

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b flex items-center px-4 py-3 shadow-sm">
        <BackButton />
        <h1 className="text-lg font-medium">Terms and Conditions</h1>
      </header>

      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="relative z-10 p-8 md:p-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Terms and Conditions</h1>
          <p className="text-white/90 max-w-xl">
            Please read these terms carefully before using Giving Hand LLC's platform that connects food donors with
            charities and shelters.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto py-8 px-4">
        {/* Introduction */}
        <Card className="mb-8 border-emerald-100 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl text-emerald-600">
              <FileText className="h-5 w-5 mr-2 text-emerald-600" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              These Terms and Conditions govern your use of Giving Hand LLC, our platform that connects food donors with
              charities and shelters. By using the app or website, you agree to these terms.
            </p>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card className="mb-8 border-emerald-100 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl text-emerald-600">
              <UserCheck className="h-5 w-5 mr-2 text-emerald-600" />
              User Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "You must provide accurate information during sign-up",
                "You must not misuse the app for fraud, spam, or abuse",
                "Organizations must only list real, safe-to-consume food donations",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Prohibited Actions */}
        <Card className="mb-8 border-emerald-100 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl text-emerald-600">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Prohibited Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "Sharing offensive or false content",
                "Impersonating others",
                "Attempting to hack or breach app security",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <XCircle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Other Sections */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-emerald-100 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl text-emerald-600">
                <Copyright className="h-5 w-5 mr-2 text-emerald-600" />
                Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All logos, branding, and features are owned by Giving Hand LLC. Copying or reuse without permission is
                prohibited.
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl text-emerald-600">
                <XCircle className="h-5 w-5 mr-2 text-red-500" />
                Account Termination
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We reserve the right to suspend or delete accounts that violate our policies.
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl text-emerald-600">
                <Scale className="h-5 w-5 mr-2 text-emerald-600" />
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We are not liable for any health or legal issues related to donated food. Responsibility lies with the
                donor and recipient.
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl text-emerald-600">
                <RefreshCw className="h-5 w-5 mr-2 text-emerald-600" />
                Modifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">These terms may change. We'll notify users of major changes.</p>
            </CardContent>
          </Card>
        </div>

        {/* Violation Rules Section */}
        <div className="bg-red-50 rounded-xl p-6 mb-8 border border-red-100">
          <div className="flex items-center mb-4">
            <AlertOctagon className="h-7 w-7 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-red-700">Violation Rules and Consequences</h2>
          </div>

          <p className="mb-6 text-muted-foreground">
            To ensure fairness, safety, and proper food handling, all charities/shelters and organizations must follow
            the guidelines below. Violations may lead to temporary suspension and internal review.
          </p>

          {/* For Charities & Shelters */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-emerald-600 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-emerald-600" />
              For Charities &amp; Shelters:
            </h3>

            <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <p className="font-semibold text-foreground mb-2">Uncollected Accepted Donations</p>
              <p className="mb-3 text-muted-foreground">
                If a charity accepts a donation ticket but fails to collect it, causing the food to expire:
              </p>
              <ul className="space-y-2 mb-2">
                <li className="flex items-start">
                  <Badge variant="outline" className="mr-2 bg-amber-50 text-amber-700 border-amber-200">
                    1st Violation
                  </Badge>
                  <span className="text-muted-foreground">
                    <span className="font-medium">1-week suspension</span> from receiving new donations
                  </span>
                </li>
                <li className="flex items-start">
                  <Badge variant="outline" className="mr-2 bg-orange-50 text-orange-700 border-orange-200">
                    2nd Violation
                  </Badge>
                  <span className="text-muted-foreground">
                    <span className="font-medium">1-month suspension</span>
                  </span>
                </li>
                <li className="flex items-start">
                  <Badge variant="outline" className="mr-2 bg-red-50 text-red-700 border-red-200">
                    3rd Violation
                  </Badge>
                  <span className="text-muted-foreground">
                    <span className="font-medium">Case escalated</span> to our moderation team for further review
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-semibold text-foreground mb-2">Misuse of Donations or False Claims</p>
              <p className="text-muted-foreground">
                If a charity provides false information or uses donations in ways that breach our mission (e.g., resale,
                misrepresentation), the case will be immediately flagged for internal investigation.
              </p>
            </div>
          </div>

          {/* For Organizations */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-emerald-600 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-emerald-600" />
              For Organizations (Hotels, Restaurants, Supermarkets):
            </h3>

            <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <p className="font-semibold text-foreground mb-2">Unsafe or Expired Food Provided</p>
              <p className="mb-3 text-muted-foreground">
                If an organization provides food that is already expired or not safe for consumption:
              </p>
              <ul className="space-y-2 mb-2">
                <li className="flex items-start">
                  <Badge variant="outline" className="mr-2 bg-amber-50 text-amber-700 border-amber-200">
                    1st Violation
                  </Badge>
                  <span className="text-muted-foreground">
                    <span className="font-medium">Warning &amp; removal</span> of the ticket
                  </span>
                </li>
                <li className="flex items-start">
                  <Badge variant="outline" className="mr-2 bg-orange-50 text-orange-700 border-orange-200">
                    2nd Violation
                  </Badge>
                  <span className="text-muted-foreground">
                    <span className="font-medium">1-week suspension</span>
                  </span>
                </li>
                <li className="flex items-start">
                  <Badge variant="outline" className="mr-2 bg-red-50 text-red-700 border-red-200">
                    3rd Violation
                  </Badge>
                  <span className="text-muted-foreground">
                    <span className="font-medium">Escalation</span> for internal investigation and quality review
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-semibold text-foreground mb-2">Frequent Last-Minute Cancellations</p>
              <p className="mb-3 text-muted-foreground">
                If an organization repeatedly creates and cancels donation tickets without proper reason:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Badge variant="outline" className="mr-2 bg-amber-50 text-amber-700 border-amber-200">
                    After 2 cancellations
                  </Badge>
                  <span className="text-muted-foreground">
                    <span className="font-medium">Formal warning</span>
                  </span>
                </li>
                <li className="flex items-start">
                  <Badge variant="outline" className="mr-2 bg-red-50 text-red-700 border-red-200">
                    After 3+ in 14 days
                  </Badge>
                  <span className="text-muted-foreground">
                    <span className="font-medium">Temporary suspension</span> and team review
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Moderation & Appeals */}
        <Card className="mb-8 border-emerald-100 shadow-md hover:shadow-lg transition-shadow bg-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl text-emerald-600">
              <Shield className="h-5 w-5 mr-2 text-emerald-600" />
              Moderation &amp; Appeals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our moderation team will carefully review repeated or severe violations. Affected users can contact us to
              provide clarification or request a review of their case by emailing{" "}
              <a
                href="mailto:info@givinghand.org"
                className="text-emerald-600 font-medium hover:text-emerald-700 underline"
              >
                info@givinghand.org
              </a>
              .
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm mt-12">
          <p>Last updated: May 19, 2025</p>
          <p className="mt-1">© 2025 Giving Hand LLC. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
