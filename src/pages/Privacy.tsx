import React from "react";
import { BackButton } from "@/components/ui/back-button";
import { motion } from "framer-motion";
import { Shield, Database, Share2, Lock, UserCheck, Mail } from "lucide-react";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <BackButton />
        <nav className="flex gap-2 text-sm text-muted-foreground">
          <span className="text-foreground font-medium">Privacy Policy</span>
        </nav>
      </div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden mb-8 shadow-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="relative z-10 p-8 md:p-12 flex flex-col items-start">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-white/90 max-w-2xl mb-6">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </p>
        </div>
      </motion.div>

      <div className="space-y-8">
        {/* What We Collect Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-full">
              <Database className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-emerald-600">What We Collect</h2>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Names, emails, phone numbers during sign-up
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Donation activity (what, when, where)
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              App usage data (optional, for analytics)
            </li>
          </ul>
        </motion.section>

        {/* How We Use Data Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-full">
              <Shield className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-emerald-600">How We Use Data</h2>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              To connect donors and charities
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              To provide analytics and improve our service
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              To communicate updates and offers
            </li>
          </ul>
        </motion.section>

        {/* Data Sharing Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-full">
              <Share2 className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-emerald-600">Data Sharing</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            We do not sell or share your personal data with third parties, except:
          </p>
          <ul className="space-y-2 text-muted-foreground pl-4">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              When legally required
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              With delivery partners (if involved)
            </li>
          </ul>
        </motion.section>

        {/* Data Security Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-full">
              <Lock className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-emerald-600">Data Security</h2>
          </div>
          <p className="text-muted-foreground">
            We use encryption and secure storage. Your information is protected.
          </p>
        </motion.section>

        {/* Your Rights Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-full">
              <UserCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-emerald-600">Your Rights</h2>
          </div>
          <p className="text-muted-foreground">
            You can request to update or delete your account data at any time.
          </p>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-full">
              <Mail className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-emerald-600">Contact</h2>
          </div>
          <p className="text-muted-foreground">
            For privacy concerns: <a href="mailto:privacy@givinghand.org" className="text-emerald-600 hover:underline">privacy@givinghand.org</a>
          </p>
        </motion.section>
      </div>
    </div>
  </div>
);

export default Privacy;
