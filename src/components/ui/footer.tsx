import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
// import { SocialIcon } from "@/components/ui/social-icon";

// Social links for icons
const socialLinks = [
  { name: "Facebook", url: "#", Icon: Facebook },
  { name: "Instagram", url: "https://www.instagram.com/giv_inghand?igsh=MW1jZGQwMGJjYnF5ZQ==", Icon: Instagram },
  { name: "LinkedIn", url: "#", Icon: Linkedin },
  { name: "Twitter", url: "#", Icon: Twitter },
];

export function Footer() {
  // State to manage the popup visibility
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Function to open the popup
  const openPopup = (e: React.MouseEvent, platform: string) => {
    // Don't show popup for Instagram
    if (platform === 'instagram') return;

    e.preventDefault(); // Prevent default action (link behavior)
    setIsPopupOpen(true); // Show the popup
  };

  // Function to close the popup
  const closePopup = () => {
    setIsPopupOpen(false); // Hide the popup
  };

  return (
    <footer className="w-full bg-background text-foreground pt-8 pb-4 border-t border-border">
      {/* Slogan and Social Media Icons */}
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-4 px-4 mb-8">
        <span className="text-lg font-semibold tracking-wide">Share. Care. Repeat.</span>
        <div className="flex space-x-4">
          <button
            onClick={(e) => openPopup(e, 'facebook')}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            aria-label="Facebook"
          >
            <Facebook className="h-5 w-5" />
          </button>
          <a
            href="https://www.instagram.com/giv_inghand?igsh=MW1jZGQwMGJjYnF5ZQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <button
            onClick={(e) => openPopup(e, 'linkedin')}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => openPopup(e, 'twitter')}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            aria-label="Twitter"
          >
            <Twitter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Popup Window - Coming Soon */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg text-center max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Coming Soon!</h2>
            <p className="mb-4">Stay tuned, we're working on it!</p>
            <button
              onClick={closePopup} // Close the popup
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Centered Links */}
      <div className="max-w-7xl mx-auto px-4 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start text-center md:text-left">
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 text-base">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-accent-foreground transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-accent-foreground transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-accent-foreground transition-colors">Contact Us</Link></li>
              <li><Link to="/login" className="hover:text-accent-foreground transition-colors">Login / Sign Up</Link></li>
            </ul>
          </div>
          {/* Legal & Policies */}
          <div>
            <h4 className="font-semibold mb-3 text-base">Legal &amp; Policy</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="hover:text-accent-foreground transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-accent-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="hover:text-accent-foreground transition-colors">Cookies Policy</Link></li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3 text-base">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Phone: <a href="tel:19006" className="hover:text-accent-foreground transition-colors font-semibold">19006</a></li>
              <li>Email: <a href="mailto:info@givinghand.org" className="hover:text-accent-foreground transition-colors">info@givinghand.org</a></li>
              <li>Address: New Cairo, Egypt</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto flex justify-center mt-8 px-4 border-t border-border pt-4">
        <span className="text-muted-foreground text-xs text-center w-full block">&copy; 2025 Giving Hand. All rights reserved.</span>
      </div>
    </footer>
  );
}