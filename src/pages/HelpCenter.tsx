import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Search, MessageCircle, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatBot } from "@/components/help/chat-bot";
import { DocumentationCard } from "@/components/help/documentation-card";

export default function HelpCenter() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole>("guest");
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState<JSX.Element | null>(null);

  const getUserRole = (): UserRole => {
    const role = localStorage.getItem("userRole") || "guest";
    if (role === "guest" || role === "charity" || role === "organization" || role === "admin") {
      return role as UserRole;
    }
    return "guest";
  };

  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);

    // Navigate within the same interface
    if (role === "charity") {
      navigate("/charity/help", { replace: true });
    } else if (role === "organization") {
      navigate("/organization/help", { replace: true });
    } else if (role === "guest") {
      // Stay on generic help page for guests
    }
    // Admin stays on the generic help page
  }, [navigate]);

  const handleSectionClick = (section: string) => {
    let content = null;
    if (section === "browse-charities") {
      content = (
        <div>
          <h2 className="text-xl font-semibold mb-4">Q&A: How to Find the Best Charity to Donate To</h2>
          <div className="space-y-4">
            <div>
              <strong>Q: How can I be sure that a charity is reputable?</strong>
              <p>A: Look for verified charities, check their transparency and review their financials. Always check for certifications and accreditations from trusted organizations.</p>
            </div>
            <div>
              <strong>Q: How do I choose a cause I care about?</strong>
              <p>A: Think about what resonates with you. Do you want to support education, health, the environment, or social justice? You can filter charities by cause to find one that aligns with your values.</p>
            </div>
            <div>
              <strong>Q: What other factors should I consider when choosing a charity?</strong>
              <p>A: Consider their impact, the efficiency of their operations, and the reviews from other donors. Also, check how your donation will be used, ensuring that the majority goes directly to the cause.</p>
            </div>
          </div>
        </div>
      );
    } else if (section === "make-donations") {
      content = (
        <div>
          <h2 className="text-xl font-semibold mb-4">Step-by-Step Donation Process</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Pick the Organization:</strong> Choose the charity or organization you wish to support based on your interests and values.</li>
            <li><strong>Proceed to Donation:</strong> Once you've selected your charity, click on the "Proceed to Donation" button to begin the donation process.</li>
            <li><strong>Enter Donation Details:</strong> Provide the necessary information such as your payment method, amount, and any optional details like a message for the recipient.</li>
            <li><strong>Confirmation:</strong> Check your email for a confirmation receipt. You will also receive a thank-you note from the organization.</li>
          </ol>
        </div>
      );
    }

    setPopupContent(content);
    setShowPopup(true);
  };

  const documentationSections = [
    {
      title: "How to Browse Charities",
      description: "Guide for finding and supporting charities",
      icon: <MessageCircle className="h-5 w-5 text-charity-primary" />,
      onClick: () => handleSectionClick("browse-charities"),
    },
    {
      title: "Making Donations",
      description: "Step-by-step guide for donation process",
      icon: <BookOpen className="h-5 w-5 text-charity-primary" />,
      onClick: () => handleSectionClick("make-donations"),
    },
  ];

  const PopupModal = ({ content, onClose }: { content: JSX.Element | null, onClose: () => void }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
        <div className="bg-white p-6 rounded-lg max-w-lg w-full relative shadow-lg transition-all duration-300 transform">
          <button onClick={onClose} className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-gray-800">
            X
          </button>
          {content}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center px-4 py-3">
          <h1 className="text-lg font-medium">Help Center</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-20">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search for help topics..."
          />
        </div>

        <Tabs defaultValue="chat" className="mb-6">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="chat">Chat Support</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-0">
            <ChatBot />
          </TabsContent>

          <TabsContent value="docs" className="mt-0">
            <div className="grid gap-4">
              {documentationSections.map((doc, index) => (
                <DocumentationCard
                  key={index}
                  title={doc.title}
                  description={doc.description}
                  icon={doc.icon}
                  onClick={doc.onClick}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {showPopup && <PopupModal content={popupContent} onClose={() => setShowPopup(false)} />}

      <BottomNav userRole={userRole} />
    </div>
  );
}