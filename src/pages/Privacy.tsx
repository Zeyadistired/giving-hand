
import React from "react";
import { BackButton } from "@/components/ui/back-button";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <header className="sticky top-0 z-10 bg-white border-b flex items-center px-4 py-3">
      <BackButton />
      <h1 className="text-lg font-medium">Privacy Policy</h1>
    </header>
    <div className="max-w-2xl mx-auto py-10 px-4 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6 text-charity-primary">Privacy Policy</h1>
      <h2 className="text-xl font-semibold mt-6 mb-2">What We Collect</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Names, emails, phone numbers during sign-up</li>
        <li>Donation activity (what, when, where)</li>
        <li>App usage data (optional, for analytics)</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Data</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>To connect donors and charities</li>
        <li>To provide analytics and improve our service</li>
        <li>To communicate updates and offers</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Data Sharing</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>We do not sell or share your personal data with third parties, except:</li>
        <ul className="list-disc pl-8">
          <li>When legally required</li>
          <li>With delivery partners (if involved)</li>
        </ul>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Data Security</h2>
      <p className="mb-4">
        We use encryption and secure storage. Your information is protected.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Your Rights</h2>
      <p className="mb-4">
        You can request to update or delete your account data at any time.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
      <p>For privacy concerns: privacy@givinghand.org</p>
    </div>
  </div>
);

export default Privacy;
