import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, MessageCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ChatBot } from "@/components/help/chat-bot";
import { DocumentationCard } from "@/components/help/documentation-card";
import { EditableWrapper } from "@/components/ui/editable-wrapper";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export default function CharityHelp() {
  const navigate = useNavigate();

  const documentationSections = [
    {
      title: "How to Accept a Donation Ticket",
      description: "Step-by-step guide for accepting or declining donations",
      icon: <MessageCircle className="h-5 w-5 text-charity-primary" />,
      content: "1. Go to your Notifications tab\n2. Review ticket details (food type, quantity, expiry)\n3. Choose Accept or Decline\n4. If accepted, select delivery method\n5. Confirm your choice"
    },
    {
      title: "Delivery Options Guide",
      description: "Understanding different delivery methods available",
      icon: <BookOpen className="h-5 w-5 text-charity-primary" />,
      content: "Available delivery methods:\n- Self pickup: Collect from organization\n- Request delivery: Organization delivers\n- Third-party delivery: Using a delivery service"
    },
    {
      title: "Tracking Accepted Tickets",
      description: "How to find and monitor your accepted donations",
      icon: <MessageCircle className="h-5 w-5 text-charity-primary" />,
      content: "Find your accepted tickets:\n1. Go to Home page\n2. View 'Accepted Tickets' section\n3. Click on any ticket for details\n4. Track status and delivery info"
    },
    {
      title: "Cancellation Process",
      description: "Steps to cancel an accepted donation",
      icon: <BookOpen className="h-5 w-5 text-charity-primary" />,
      content: "To cancel an accepted donation:\n1. Find the ticket in your accepted list\n2. Click 'Cancel Acceptance'\n3. Provide cancellation reason\n4. Confirm cancellation"
    },
    {
      title: "Privacy & Data Usage",
      description: "Understanding how your data is handled",
      icon: <MessageCircle className="h-5 w-5 text-charity-primary" />,
      content: "Your data privacy:\n- Contact info used for donations only\n- Location data for delivery coordination\n- History kept for 12 months\n- No data shared with third parties"
    }
  ];

  const [selectedDoc, setSelectedDoc] = useState<null | typeof documentationSections[0]>(null);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <EditableWrapper onSave={(value) => console.log("Header title edited:", value)}>
            <h1 className="text-lg font-medium">Help Center</h1>
          </EditableWrapper>
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
            <EditableWrapper onSave={(value) => console.log("Tab chat edited:", value)}>
              <TabsTrigger value="chat">Chat Support</TabsTrigger>
            </EditableWrapper>
            <EditableWrapper onSave={(value) => console.log("Tab docs edited:", value)}>
              <TabsTrigger value="docs">Documentation</TabsTrigger>
            </EditableWrapper>
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
                  onClick={() => setSelectedDoc(doc)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-charity-primary">
                {selectedDoc?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="whitespace-pre-wrap text-sm text-muted-foreground">
              {selectedDoc?.content}
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <BottomNav userRole="charity" />
    </div>
  );
}
