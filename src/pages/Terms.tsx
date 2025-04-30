import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-white border-b flex items-center px-4 py-3">
        <BackButton />
        <h1 className="text-lg font-medium">Terms and Conditions</h1>
      </header>
      <div className="max-w-2xl mx-auto py-10 px-4 bg-white rounded-lg shadow mt-6">
        <h1 className="text-3xl font-bold mb-6 text-charity-primary">Terms and Conditions (T&amp;C)</h1>
        <h2 className="text-xl font-semibold mt-6 mb-2">Introduction</h2>
        <p className="mb-4">
          These Terms and Conditions govern your use of [App Name], our platform that connects food donors with charities and shelters. By using the app or website, you agree to these terms.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">User Responsibilities</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>You must provide accurate information during sign-up</li>
          <li>You must not misuse the app for fraud, spam, or abuse</li>
          <li>Organizations must only list real, safe-to-consume food donations</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Prohibited Actions</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Sharing offensive or false content</li>
          <li>Impersonating others</li>
          <li>Attempting to hack or breach app security</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Intellectual Property</h2>
        <p className="mb-4">
          All logos, branding, and features are owned by [App Name]. Copying or reuse without permission is prohibited.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Account Termination</h2>
        <p className="mb-4">
          We reserve the right to suspend or delete accounts that violate our policies.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Limitation of Liability</h2>
        <p className="mb-4">
          We are not liable for any health or legal issues related to donated food. Responsibility lies with the donor and recipient.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Modifications</h2>
        <p className="mb-10">
          These terms may change. We’ll notify users of major changes.
        </p>
        {/* New Section: Violation Rules and Consequences */}
        <h2 className="text-xl font-bold mt-10 mb-4 text-red-700 flex items-center gap-2">
          <span role="img" aria-label="warning">⚠️</span> Violation Rules and Consequences
        </h2>
        <p className="mb-4">
          To ensure fairness, safety, and proper food handling, all charities/shelters and organizations must follow the guidelines below. Violations may lead to temporary suspension and internal review.
        </p>

        {/* For Charities & Shelters */}
        <h3 className="text-lg font-semibold mt-6 mb-2 text-charity-primary">For Charities &amp; Shelters:</h3>
        <div className="mb-4">
          <p className="font-semibold">Uncollected Accepted Donations</p>
          <p className="mb-2 text-neutral-700">
            If a charity accepts a donation ticket but fails to collect it, causing the food to expire:
          </p>
          <ul className="list-disc pl-8 mb-2">
            <li>1st Violation → <span className="font-semibold">1-week suspension</span> from receiving new donations</li>
            <li>2nd Violation → <span className="font-semibold">1-month suspension</span></li>
            <li>3rd Violation → <span className="font-semibold">Case escalated</span> to our moderation team for further review</li>
          </ul>
          <p className="font-semibold mt-3">Misuse of Donations or False Claims</p>
          <p className="mb-2 text-neutral-700">
            If a charity provides false information or uses donations in ways that breach our mission (e.g., resale, misrepresentation), the case will be immediately flagged for internal investigation.
          </p>
        </div>

        {/* For Organizations */}
        <h3 className="text-lg font-semibold mt-8 mb-2 text-charity-primary">For Organizations (Hotels, Restaurants, Supermarkets):</h3>
        <div className="mb-4">
          <p className="font-semibold">Unsafe or Expired Food Provided</p>
          <p className="mb-2 text-neutral-700">
            If an organization provides food that is already expired or not safe for consumption:
          </p>
          <ul className="list-disc pl-8 mb-2">
            <li>1st Violation → <span className="font-semibold">Warning &amp; removal</span> of the ticket</li>
            <li>2nd Violation → <span className="font-semibold">1-week suspension</span></li>
            <li>3rd Violation → <span className="font-semibold">Escalation</span> for internal investigation and quality review</li>
          </ul>
          <p className="font-semibold mt-3">Frequent Last-Minute Cancellations</p>
          <p className="mb-2 text-neutral-700">
            If an organization repeatedly creates and cancels donation tickets without proper reason:
          </p>
          <ul className="list-disc pl-8">
            <li>After 2 repeated cancellations → <span className="font-semibold">Formal warning</span></li>
            <li>After 3 or more within 14 days → <span className="font-semibold">Temporary suspension</span> and team review</li>
          </ul>
        </div>

        {/* Moderation & Appeals */}
        <h3 className="text-lg font-semibold mt-8 mb-2 text-green-700 flex items-center gap-2">
          <span role="img" aria-label="shield"></span> Moderation &amp; Appeals
        </h3>
        <div className="mb-2">
          <p>
            Our moderation team will carefully review repeated or severe violations. Affected users can contact us to provide clarification or request a review of their case by emailing
            {" "}
            <a href="mailto:info@givinghand.org" className="text-[#45A761] underline hover:text-green-800">info@givinghand.org</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
