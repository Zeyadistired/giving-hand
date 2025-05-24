import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, Phone, Heart } from "lucide-react";
import { useState } from "react";
import { BackButton } from "@/components/ui/back-button";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const { pathname } = useLocation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <BackButton />
          <nav className="flex gap-2 text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Contact Us</span>
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
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Get in Touch</h1>
            <p className="text-white/90 max-w-2xl mb-6">
              Have questions about our food donation platform? We're here to help! Reach out to us through any of the channels below.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium text-emerald-600">Email</h3>
                  <a href="mailto:info@givinghand.org" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                    info@givinghand.org
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium text-emerald-600">Address</h3>
                  <p className="text-muted-foreground">New Cairo, Egypt</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium text-emerald-600">Phone</h3>
                  <p className="text-muted-foreground">+20 123 456 7890</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <h3 className="font-medium text-emerald-600 mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-10 w-10"
                  asChild
                >
                  <a
                    href="https://www.instagram.com/giv_inghand?igsh=MW1jZGQwMGJjYnF5ZQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                  </a>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </div>
            </div>
          </motion.section>

          {/* Contact Form */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-100 p-2 rounded-full">
                <Heart className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-emerald-600">Send us a message</h3>
            </div>

            <form className="space-y-4 flex-1 flex flex-col" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  name="name"
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2 flex-1 flex flex-col">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <Textarea
                  name="message"
                  id="message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full min-h-[120px] flex-1"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Send Message
              </Button>
              {submitted && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-emerald-600 text-sm text-center"
                >
                  Thank you for contacting us! We'll get back to you soon.
                </motion.div>
              )}
            </form>
          </motion.section>

          {/* Map Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-100 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-emerald-600">Our Location</h3>
            </div>
            {/* Map Container with explicit dimensions */}
            <div 
              className="w-full h-[250px] relative"
              style={{ 
                minWidth: '100%',
                minHeight: '250px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '12px'
              }}
            >
              <iframe
                title="Giving Hand Location in New Cairo"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.072771998445!2d31.46271531511264!3d30.045361581883107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583d2c4efc5b69%3A0xa8e41d973aa09ab6!2sNew%20Cairo%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1587391103783!5m2!1sen!2seg"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                  borderRadius: '12px'
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
