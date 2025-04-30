import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";
import { BackButton } from "@/components/ui/back-button";
import { useLocation } from "react-router-dom";

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
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <BackButton />
        <h1 className="text-2xl font-bold text-foreground">Contact Us</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <section className="bg-white rounded-lg shadow p-6 text-base flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-charity-primary">Contact Us</h2>
            <div>
              <span className="block mb-1 font-semibold">Email:</span>
              <a href="mailto:info@givinghand.org" className="text-charity-primary hover:underline">info@givinghand.org</a>
            </div>
            <div>
              <span className="block mb-1 font-semibold">Address:</span>
              New Cairo, Egypt
            </div>
          </div>
          <div>

          </div>
        </section>

        {/* Contact Form */}
        <section className="bg-white rounded-lg shadow p-6 flex flex-col">
          <h3 className="text-xl font-semibold mb-2 text-charity-primary">Send us a message</h3>
          <form className="space-y-4 flex-1 flex flex-col" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block mb-1 font-medium">Name</label>
              <input
                name="name"
                id="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 font-medium">Email</label>
              <input
                name="email"
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label htmlFor="message" className="block mb-1 font-medium">Message</label>
              <textarea
                name="message"
                id="message"
                value={form.message}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 min-h-[80px] flex-1"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-charity-primary text-white rounded px-6 py-2 font-bold hover:bg-charity-dark transition"
            >
              Submit
            </button>
            {submitted && (
              <div className="mt-2 text-green-600 text-sm">Thank you for contacting us! We'll get back to you soon.</div>
            )}
          </form>
        </section>

        {/* Map Section */}
        <section className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-3 text-charity-primary">Our Location</h3>
          <div className="w-full h-64 rounded overflow-hidden">
  <iframe
    title="Giving Hand Location"
    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13812.209029611318!2d31.463293!3d30.001255!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583d3d149d84ef%3A0x4575bb0ae9ae7c13!2sGiving%20Hand!5e0!3m2!1sen!2seg!4v1713979810322!5m2!1sen!2seg"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>
        </section>
      </div>
    </div>
  );
}
