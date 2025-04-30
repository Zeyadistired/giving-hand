import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { useLocation } from "react-router-dom";

export default function About() {
  const { pathname } = useLocation();

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-10">
      <div className="flex items-center mb-4">
        <BackButton />
        <h1 className="text-2xl font-bold text-foreground">About Us</h1>
      </div>
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-2 text-charity-primary">Mission Statement</h2>
        <p className="text-muted-foreground">
          We aim to bridge the gap between food surplus and hunger by connecting hotels, restaurants, and supermarkets with charities and shelters across Egypt. Our goal is to reduce food waste and help those in need.
        </p>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-2 text-charity-primary">What We Do</h3>
        <ul className="list-disc ml-6 space-y-1 text-base text-gray-700">
          <li>We collect food donations from organizations (hotels, restaurants, supermarkets)</li>
          <li>We distribute them to verified charities and shelters</li>
          <li>We promote sustainability and reduce waste</li>
          <li>We offer analytics and incentives for our partners</li>
        </ul>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-2 text-charity-primary">Our Impact</h3>
        <ul className="space-y-1 text-base text-gray-700">
          <li>Meals delivered: <span className="font-bold">1482</span></li>
          <li>Food saved from waste: <span className="font-bold">573KG</span></li>
          <li>Families supported: <span className="font-bold">284</span></li>
        </ul>
        <p className="text-xs text-gray-400 mt-2">*We'll update these stats as our impact grows!</p>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-2 text-charity-primary">Our Team</h3>
        <p>
          Built by passionate students from Egypt University of Informatics dedicated to social good.
        </p>
      </section>
    </div>
  );
}
