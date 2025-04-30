
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, MessageCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ChatBot } from "@/components/help/chat-bot";
import { DocumentationCard } from "@/components/help/documentation-card";
import { organizationHelpContent } from "@/data/help-center/organization-content";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Phone } from "lucide-react";
import { EditableWrapper } from "@/components/ui/editable-wrapper";

export default function OrganizationHelp() {
  const navigate = useNavigate();
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

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
          <EditableWrapper onSave={(value) => console.log("Header edited:", value)}>
            <h1 className="text-lg font-medium">Organization Help Center</h1>
          </EditableWrapper>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-20">
        <div className="mb-6">
          <EditableWrapper onSave={(value) => console.log("Title edited:", value)}>
            <h1 className="text-2xl font-bold text-charity-primary mb-1">
              Organization Support
            </h1>
          </EditableWrapper>
          <EditableWrapper onSave={(value) => console.log("Description edited:", value)}>
            <p className="text-muted-foreground">
              Find answers to ticket creation and donation management questions
            </p>
          </EditableWrapper>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search for help topics..."
          />
        </div>

        <Tabs defaultValue="faq" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <EditableWrapper onSave={(value) => console.log("Tab faq edited:", value)}>
              <TabsTrigger value="faq">FAQs</TabsTrigger>
            </EditableWrapper>
            <EditableWrapper onSave={(value) => console.log("Tab chat edited:", value)}>
              <TabsTrigger value="chat">Chat Support</TabsTrigger>
            </EditableWrapper>
            <EditableWrapper onSave={(value) => console.log("Tab docs edited:", value)}>
              <TabsTrigger value="docs">Documentation</TabsTrigger>
            </EditableWrapper>
          </TabsList>
          
          <TabsContent value="faq" className="space-y-4 mt-0">
            <Accordion type="single" collapsible>
              {organizationHelpContent.faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`}>
                  <EditableWrapper onSave={(value) => console.log(`FAQ question ${index} edited:`, value)}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                  </EditableWrapper>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          
          <TabsContent value="chat" className="mt-0">
            <ChatBot userRole="organization" />
          </TabsContent>
          
          <TabsContent value="docs" className="mt-0">
            <div className="grid gap-4">
              {organizationHelpContent.documentation.map((doc, index) => (
                <DocumentationCard
                  key={index}
                  title={doc.title}
                  description={doc.description}
                  icon={doc.icon}
                  onClick={() => setSelectedDoc(doc)}
                />
              ))}
            </div>
            
            {selectedDoc && (
              <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
                <DialogContent className="max-h-[80vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>
                      <EditableWrapper onSave={(value) => console.log("Dialog title edited:", value)}>
                        {selectedDoc.title}
                      </EditableWrapper>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <EditableWrapper onSave={(value) => console.log("Dialog content edited:", value)} multiline>
                      <p className="whitespace-pre-line">{selectedDoc.content}</p>
                    </EditableWrapper>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />
        
        <div className="text-center">
          <EditableWrapper onSave={(value) => console.log("Support heading edited:", value)}>
            <h3 className="font-medium mb-2">Need more help?</h3>
          </EditableWrapper>
          <EditableWrapper onSave={(value) => console.log("Support description edited:", value)}>
            <p className="text-sm text-muted-foreground mb-4">Our support team is available 9am-5pm EET</p>
          </EditableWrapper>
          <Button className="bg-charity-primary hover:bg-charity-dark">
            <Phone className="h-4 w-4 mr-2" />
            <EditableWrapper onSave={(value) => console.log("Support contact edited:", value)}>
              <span>Contact Support: 19006</span>
            </EditableWrapper>
          </Button>
        </div>
      </main>

      <BottomNav userRole="organization" />
    </div>
  );
}
