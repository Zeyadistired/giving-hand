
import React from "react";
import { BackButton } from "@/components/ui/back-button";

const Cookies = () => (
  <div className="min-h-screen bg-background">
    <header className="sticky top-0 z-10 bg-white border-b flex items-center px-4 py-3">
      <BackButton />
      <h1 className="text-lg font-medium">Cookies Policy</h1>
    </header>
    <div className="max-w-2xl mx-auto py-10 px-4 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6 text-charity-primary">Cookies Policy</h1>
      <h2 className="text-xl font-semibold mt-6 mb-2">Do You Use Cookies?</h2>
      <p className="mb-4">
        Yes. We use cookies to:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Remember your login</li>
        <li>Track how users use the app</li>
        <li>Improve performance and personalization</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Types of Cookies</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Essential cookies (for login and security)</li>
        <li>Performance cookies (Google Analytics etc.)</li>
        <li>Preference cookies (remembering settings)</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Can I Disable Cookies?</h2>
      <p>
        Yes, from your browser settings. But this may affect how our app works.
      </p>
    </div>
  </div>
);

export default Cookies;
