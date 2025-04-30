import { useState, useRef, useEffect } from "react";
import { SendHorizontal, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { UserRole } from "@/types";

interface ChatBotProps {
  userRole?: UserRole;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  options?: ChatOption[];
}

interface ChatOption {
  id: string;
  text: string;
  value: string;
  emoji?: string;
}

// Base dialog flows shared by all roles
const baseDialogFlows = {
  support: {
    en: "Our support team is available 9am-5pm EET. Would you like us to connect you with a human agent?",
    ar: "فريق الدعم متاح من ٩ صباحًا إلى ٥ مساءً بتوقيت القاهرة. هل ترغب في التواصل مع أحد المختصين؟",
    options: [
      { id: "yes", text: "✅ Yes, please | نعم، من فضلك", value: "yes", emoji: "✅" },
      { id: "back", text: "↩️ Back to menu | العودة للقائمة", value: "back", emoji: "↩️" }
    ]
  },
  yes: {
    en: "Thanks for your patience. A support agent will reach out to you shortly. In the meantime, is there anything else I can help you with?",
    ar: "شكرًا لصبرك. سيتواصل معك أحد ممثلي الدعم قريبًا. في هذه الأثناء، هل هناك أي شيء آخر يمكنني مساعدتك به؟",
    options: [
      { id: "back", text: "↩️ Back to menu | العودة للقائمة", value: "back", emoji: "↩️" }
    ]
  }
};

// Charity-specific dialog flows
const charityDialogFlows = {
  mainGreeting: {
    en: "Hi there! I'm your charity support assistant. How can I help you today?",
    ar: "مرحبًا! أنا مساعدك في دعم الجمعيات الخيرية. كيف يمكنني مساعدتك اليوم؟",
    options: [
      { id: "accept", text: "🛒 Accept/Decline donations | قبول/رفض التبرعات", value: "accept", emoji: "🛒" },
      { id: "delivery", text: "🚚 Delivery Options | خيارات التوصيل", value: "delivery", emoji: "🚚" },
      { id: "track", text: "📦 Track tickets | تتبع التذاكر", value: "track", emoji: "📦" },
      { id: "support", text: "🙋 Contact Support | تواصل مع الدعم", value: "support", emoji: "🙋" }
    ]
  },
  accept: {
    en: "Here's how to accept/decline donations:\n\n1. Go to your Notifications tab\n2. Review the ticket details (food type, quantity, expiry)\n3. Choose Accept or Decline\n4. If accepted, you'll be prompted to choose a delivery method\n5. Pick-up / Request delivery / Contact organization",
    ar: "طريقة قبول/رفض التبرعات:\n\n١. اذهب إلى علامة التبويب الإشعارات\n٢. راجع تفاصيل التذكرة (نوع الطعام، الكمية، تاريخ الانتهاء)\n٣. اختر قبول أو رفض\n٤. إذا قبلت، سيُطلب منك اختيار طريقة التسليم\n٥. استلام / طلب توصيل / التواصل مع المؤسسة",
    options: [
      { id: "back", text: "↩️ Back to menu | العودة للقائمة", value: "back", emoji: "↩️" },
      { id: "delivery", text: "🚚 Ask about delivery | السؤال عن التوصيل", value: "delivery", emoji: "🚚" }
    ]
  },
  delivery: {
    en: "To choose the delivery method after accepting:\n\n1. After accepting a donation, you'll see a prompt\n2. Select one of the options: Pick-up, Request delivery, or Contact organization\n3. Confirm your choice",
    ar: "لاختيار طريقة التسليم بعد القبول:\n\n١. بعد قبول التبرع، سترى مطالبة\n٢. حدد أحد الخيارات: استلام، طلب توصيل، أو التواصل مع المؤسسة\n٢. أكد اختيارك",
    options: [
      { id: "back", text: "↩️ Back to menu | العودة للقائمة", value: "back", emoji: "↩️" },
      { id: "track", text: "📦 Track accepted tickets | تتبع التذاكر المقبولة", value: "track", emoji: "📦" }
    ]
  },
  track: {
    en: "To track accepted tickets:\n\n1. Go to the Home page\n2. View the 'Accepted Tickets' section\n3. Click on any ticket for details\n4. Track status and delivery info",
    ar: "لتتبع التذاكر المقبولة:\n\n١. اذهب إلى الصفحة الرئيسية\n٢. عرض قسم 'التذاكر المقبولة'\n٢. انقر على أي تذكرة للاطلاع على التفاصيل\n٣. تتبع الحالة ومعلومات التسليم",
    options: [
      { id: "back", text: "↩️ Back to menu | العودة للقائمة", value: "back", emoji: "↩️" },
      { id: "cancel", text: "🔄 Cancel accepted donation | إلغاء التبرع المقبول", value: "cancel", emoji: "🔄" }
    ]
  },
  cancel: {
    en: "To cancel an accepted donation:\n\n1. Find the ticket in your accepted list\n2. Click 'Cancel Acceptance'\n3. Provide cancellation reason\n4. Confirm cancellation",
    ar: "لإلغاء تبرع مقبول:\n\n١. ابحث عن التذكرة في قائمتك المقبولة\n٢. انقر فوق 'إلغاء القبول'\n٢. قدم سبب الإلغاء\n٣. تأكيد الإلغاء",
    options: [
      { id: "back", text: "↩️ Back to menu | العودة للقائمة", value: "back", emoji: "↩️" },
      { id: "support", text: "🙋 Contact Support | تواصل مع الدعم", value: "support", emoji: "🙋" }
    ]
  },
  fallback: {
    en: "Sorry, I didn't understand that. Please choose one of the help options:",
    ar: "عذرًا، لم أفهم. من فضلك اختر أحد خيارات المساعدة التالية:",
    options: [
      { id: "accept", text: "🛒 How do I accept or decline donations? | كيف أقبل أو أرفض التبرعات؟", value: "accept", emoji: "🛒" },
      { id: "delivery", text: "🚚 How do I choose the delivery method? | كيف أختار وسيلة التوصيل؟", value: "delivery", emoji: "🚚" },
      { id: "track", text: "📦 Where do I track accepted tickets? | أين أتابع التذاكر المقبولة؟", value: "track", emoji: "📦" },
      { id: "cancel", text: "🔄 Can I cancel after accepting? | هل يمكنني الإلغاء بعد القبول؟", value: "cancel", emoji: "🔄" },
      { id: "support", text: "🙋 Contact support | التواصل مع فريق الدعم", value: "support", emoji: "🙋" }
    ]
  }
};

// Guest-specific dialog flows
const guestDialogFlows = {
  mainGreeting: {
    en: "Welcome! I'm your guest support assistant. How can I help with your donation?",
    ar: "مرحبًا! أنا مساعدك في دعم الضيوف. كيف يمكنني المساعدة في تبرعك؟",
    options: [
      { id: "payment", text: "💳 Payment methods | طرق الدفع", value: "payment", emoji: "💳" },
      { id: "track", text: "🔍 Track my donation | تتبع تبرعي", value: "track", emoji: "🔍" },
      { id: "refund", text: "↩️ Refund policy | سياسة الاسترداد", value: "refund", emoji: "↩️" },
      { id: "support", text: "🙋 Contact Support | تواصل مع الدعم", value: "support", emoji: "🙋" }
    ]
  },
  payment: {
    en: "We support the following payment methods:\n\n1. Credit/Debit Cards (Visa & Mastercard)\n2. Fawry Pay at any Fawry outlet\n3. Mobile wallets\n\nAll transactions are secure and encrypted.",
    ar: "نحن ندعم طرق الدفع التالية:\n\n١. بطاقات الائتمان/الخصم (فيزا وماستركارد)\n٢. فوري باي في أي منفذ فوري\n٢. محافظ الهاتف المحمول\n\nجميع المعاملات آمنة ومشفرة.",
    options: [
      { id: "back", text: "↩️ Back to menu | العودة للقائمة", value: "back", emoji: "↩️" },
      { id: "declined", text: "❓ My payment was declined | تم رفض الدفع الخاص بي", value: "declined", emoji: "❓" }
    ]
  },
  declined: {
    en: "If your payment was declined, it might be due to:\n\n1. Insufficient funds\n2. Card verification failed\n3. Card expired or invalid\n\nPlease try another payment method or contact your bank.",
    ar: "إذا تم رفض الدفع الخاص بك، فقد يكون ذلك بسبب:\n\n١. عدم كفاية الرصيد\n٢. فشل التحقق من البطاقة\n٣. البطاقة منتهية الصلاحية أو غير صالحة\n\nيرجى تجربة طريقة دفع أخرى أو الاتصال بالبنك الخاص بك.",
    options: [
      { id: "back", text: "↩️ Back to menu | العودة للقائمة", value: "back", emoji: "↩️" },
      { id: "support", text: "🙋 Contact Support | تواصل مع الدعم", value: "support", emoji: "🙋" }
    ]
  },
  track: {
    en: "To track your donation:\n\n1. Use the donation reference number sent to your email\n2. Check the 'Track Donation' section on the homepage\n3. Enter your reference number to see status",
    ar: "لتتبع تبرعك:\n\n١. استخدم رقم مرجع التبرع المرسل إلى بريدك الإلكتروني\n٢. تحقق من قسم 'تتبع التبرع' في الصفحة الرئيسية\n٢. أدخل رقم المرجع الخاص بك لمعرفة الحالة",
    options: [
      { id: "back", text: "↩️ Back to menu | العودة للقائمة", value: "back", emoji: "↩️" },
      { id: "no_email", text: "📧 Didn't receive email | لم أتلق البريد الإلكتروني", value: "no_email", emoji: "📧" }
    ]
  },
  refund: {
    en: "Our refund policy:\n\n1. Donations are generally non-refundable\n2. For exceptional cases, contact support within 24 hours\n3. Processing fees may be deducted from refunded amounts",
    ar: "سياسة الاسترداد لدينا:\n\n١. التبرعات غير قابلة للاسترداد بشكل عام\n٢. في الحالات الاستثنائية، اتصل بالدعم خلال 24 ساعة\n٣. قد يتم خصم رسوم المعالجة من المبالغ المستردة",
    options: [
      { id: "back", text: "↩️ Back to menu | العودة للقائمة", value: "back", emoji: "↩️" },
      { id: "support", text: "🙋 Contact Support | تواصل مع الدعم", value: "support", emoji: "🙋" }
    ]
  },
  fallback: {
    en: "Sorry, I didn't understand that. Please choose one of the help options:",
    ar: "عذرًا، لم أفهم. من فضلك اختر أحد خيارات المساعدة التالية:",
    options: [
      { id: "payment", text: "💳 Payment methods | طرق الدفع", value: "payment", emoji: "💳" },
      { id: "track", text: "🔍 Track my donation | تتبع تبرعي", value: "track", emoji: "🔍" },
      { id: "refund", text: "↩️ Refund policy | سياسة الاسترداد", value: "refund", emoji: "↩️" },
      { id: "support", text: "🙋 Contact support | التواصل مع فريق الدعم", value: "support", emoji: "🙋" }
    ]
  }
};

// Organization-specific dialog flows
const organizationDialogFlows = {
  mainGreeting: {
    en: "Hello! I'm your organization support assistant. How can I help you today?",
    ar: "مرحبًا! أنا مساعدك في دعم المؤسسات. كيف يمكنني مساعدتك اليوم؟",
    options: [
      { id: "create", text: "🎟️ Create ticket | إنشاء تذكرة", value: "create", emoji: "🎟️" },
      { id: "manage", text: "📋 Manage donations | إدارة التبرعات", value: "manage", emoji: "📋" },
      { id: "edit", text: "✏️ Edit ticket | تعديل تذكرة", value: "edit", emoji: "✏️" },
      { id: "support", text: "🙋 Contact Support | تواصل مع الدعم", value: "support", emoji: "🙋" }
    ]
  },
  create: {
    en: "To create a donation ticket:\n\n1. Click 'Create Ticket' on your dashboard\n2. Fill in food details (type, quantity, expiry)\n3. Add any special handling instructions\n4. Submit for review by nearby charities",
    ar: "لإنشاء تذكرة تبرع:\n\n١. انقر على 'إنشاء تذكرة' في لوحة التحكم الخاصة بك\n٢. املأ تفاصيل الطعام (النوع، الكمية، تاريخ انتهاء الصلاحية)\n٢. أضف أي تعليمات خاصة بالتعامل مع الطعام\n٣. قدم للمراجعة من قبل الجمعيات الخيرية القريبة",
    options: [
      { id: "back", text: "↩️ Back to menu | العودة للقائمة", value: "back", emoji: "↩️" },
      { id: "categories", text: "🔍 Food categories | فئات الطعام", value: "categories", emoji: "🔍" }
    ]
  },
  manage: {
    en: "To manage your active donations:\n\n1. Go to the 'Active Donations' tab\n2. Review charity acceptance status\n3. Coordinate delivery details\n4. Complete the donation process",
    ar: "لإدارة تبرعاتك النشطة:\n\n١. انتقل إلى علامة التبويب 'التبرعات النشطة'\n٢. راجع حالة قبول الجمعية الخيرية\n٢. تنسيق تفاصيل التسليم\n٣. إكمال عملية التبرع",
    options: [
      { id: "back", text: "↩️ Back to menu | العودة للقائمة", value: "back", emoji: "↩️" },
      { id: "history", text: "📜 Donation history | سجل التبرعات", value: "history", emoji: "📜" }
    ]
  },
  edit: {
    en: "To edit a donation ticket:\n\n1. Find the ticket in your active donations\n2. Click the 'Edit' button\n3. Make necessary changes\n4. Save changes\n\nNote: You can only edit tickets that haven't been accepted yet.",
    ar: "لتعديل تذكرة التبرع:\n\n١. ابحث عن التذكرة في تبرعاتك النشطة\n٢. انقر على زر 'تعديل'\n٣. قم بإجراء التغييرات اللازمة\n٤. احفظ التغييرات\n\nملاحظة: يمكنك فقط تعديل التذاكر التي لم يتم قبولها بعد.",
    options: [
      { id: "back", text: "↩️ Back to menu | العودة للقائمة", value: "back", emoji: "↩️" },
      { id: "delete", text: "🗑️ Delete ticket | حذف تذكرة", value: "delete", emoji: "🗑️" }
    ]
  },
  categories: {
    en: "Food categories in our system:\n\n1. Prepared meals (hot/cold)\n2. Produce (fruits/vegetables)\n3. Bakery items (bread/pastries)\n4. Dairy products\n5. Dry goods (rice/pasta/etc.)\n\nChoose the most specific category for your donation.",
    ar: "فئات الطعام في نظامنا:\n\n١. وجبات جاهزة (ساخنة/باردة)\n٢. منتجات (فواكه/خضروات)\n٣. منتجات المخبز (خبز/معجنات)\n٤. منتجات الألبان\n٥. سلع جافة (أرز/معكرونة/إلخ.)\n\nاختر الفئة الأكثر تحديدًا لتبرعك.",
    options: [
      { id: "back", text: "↩️ Back to menu | العودة للقائمة", value: "back", emoji: "↩️" },
      { id: "create", text: "🎟️ Create ticket | إنشاء تذكرة", value: "create", emoji: "🎟️" }
    ]
  },
  fallback: {
    en: "Sorry, I didn't understand that. Please choose one of the help options:",
    ar: "عذرًا، لم أفهم. من فضلك اختر أحد خيارات المساعدة التالية:",
    options: [
      { id: "create", text: "🎟️ How to create a ticket? | كيفية إنشاء تذكرة؟", value: "create", emoji: "🎟️" },
      { id: "manage", text: "📋 Manage active donations | إدارة التبرعات النشطة", value: "manage", emoji: "📋" },
      { id: "edit", text: "✏️ Can I edit a ticket? | هل يمكنني تعديل تذكرة؟", value: "edit", emoji: "✏️" },
      { id: "support", text: "🙋 Contact support | التواصل مع فريق الدعم", value: "support", emoji: "🙋" }
    ]
  }
};

// Find the appropriate response based on role and input
const findResponse = (userRole: UserRole, input: string): { flow: string, options: ChatOption[] } => {
  const lowercaseInput = input.toLowerCase();
  
  // Get the appropriate dialog flows based on user role
  let dialogFlows: any;
  
  switch(userRole) {
    case "charity":
      dialogFlows = { ...baseDialogFlows, ...charityDialogFlows };
      break;
    case "guest":
      dialogFlows = { ...baseDialogFlows, ...guestDialogFlows };
      break;
    case "organization":
      dialogFlows = { ...baseDialogFlows, ...organizationDialogFlows };
      break;
    case "admin":
      // Admin uses the same dialog as charity for now
      dialogFlows = { ...baseDialogFlows, ...charityDialogFlows };
      break;
    default:
      dialogFlows = { ...baseDialogFlows, ...guestDialogFlows };
  }
  
  // Check for greetings in both languages
  if (
    lowercaseInput.includes('hi') || 
    lowercaseInput.includes('hello') || 
    lowercaseInput.includes('hey') ||
    lowercaseInput.includes('سلام') || 
    lowercaseInput.includes('مرحبا') || 
    lowercaseInput.includes('اهلا')
  ) {
    return { 
      flow: 'mainGreeting',
      options: dialogFlows.mainGreeting.options
    };
  }
  
  // Check for back to menu
  if (
    lowercaseInput.includes('back') || 
    lowercaseInput.includes('menu') ||
    lowercaseInput.includes('رجوع') || 
    lowercaseInput.includes('قائمة')
  ) {
    return { 
      flow: 'mainGreeting',
      options: dialogFlows.mainGreeting.options 
    };
  }
  
  // Check for yes confirmation
  if (
    lowercaseInput.includes('yes') || 
    lowercaseInput.includes('yeah') ||
    lowercaseInput.includes('نعم') || 
    lowercaseInput.includes('أجل')
  ) {
    return { 
      flow: 'yes',
      options: dialogFlows.yes.options
    };
  }
  
  // Check for role-specific keywords
  for (const [key, value] of Object.entries(dialogFlows)) {
    if (key === 'mainGreeting' || key === 'fallback' || key === 'yes' || key === 'support') {
      continue;
    }
    
    // Check if the input matches any keyword for this dialog flow
    if (lowercaseInput.includes(key)) {
      return {
        flow: key,
        options: (value as any).options
      };
    }
  }
  
  // Default fallback
  return { 
    flow: 'fallback',
    options: dialogFlows.fallback.options 
  };
};

export function ChatBot({ userRole = "charity" }: ChatBotProps) {
  // Use a different initial message based on user role
  const getInitialMessage = () => {
    let dialogFlows;
    
    switch(userRole) {
      case "charity":
        dialogFlows = { ...baseDialogFlows, ...charityDialogFlows };
        break;
      case "guest":
        dialogFlows = { ...baseDialogFlows, ...guestDialogFlows };
        break;
      case "organization":
        dialogFlows = { ...baseDialogFlows, ...organizationDialogFlows };
        break;
      case "admin":
        dialogFlows = { ...baseDialogFlows, ...charityDialogFlows };
        break;
      default:
        dialogFlows = { ...baseDialogFlows, ...guestDialogFlows };
    }
    
    return {
      id: '1',
      text: dialogFlows.mainGreeting.en + "\n\n" + dialogFlows.mainGreeting.ar,
      sender: 'bot' as const,
      timestamp: new Date(),
      options: dialogFlows.mainGreeting.options
    };
  };

  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [input, setInput] = useState('');
  const [expectingPhone, setExpectingPhone] = useState(false);
  const [error, setError] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [providedPhone, setProvidedPhone] = useState<string | null>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const isValidEgyptianPhone = (phone: string) => /^(010|011|012|015)[0-9]{8}$/.test(phone);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    // If expecting phone input:
    if (expectingPhone && userRole === "guest") {
      const value = input.trim();
      if (!isValidEgyptianPhone(value)) {
        setError("Please enter a valid Egyptian phone number.");
        return;
      }
      setError('');
      setProvidedPhone(value);

      const userMessage: Message = {
        id: Date.now().toString(),
        text: value,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text:
              "✅ Thank you! Our support team will contact you soon at " +
              value +
              ".\n\nسيتواصل معك فريق الدعم قريبًا على هذا الرقم.",
            sender: "bot",
            timestamp: new Date(),
            options: [
              { id: "back", text: "↩️ Back to menu | العودة للقائمة", value: "back", emoji: "↩️" }
            ]
          }
        ]);
      }, 500);

      setInput("");
      setExpectingPhone(false);
      return;
    }

    // Standard flow:
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Get bot response based on input and user role
    const response = findResponse(userRole, input);

    // Get the appropriate dialog flows based on user role
    let dialogFlows;
    switch(userRole) {
      case "charity":
        dialogFlows = { ...baseDialogFlows, ...charityDialogFlows };
        break;
      case "guest":
        dialogFlows = { ...baseDialogFlows, ...guestDialogFlows };
        break;
      case "organization":
        dialogFlows = { ...baseDialogFlows, ...organizationDialogFlows };
        break;
      case "admin":
        dialogFlows = { ...baseDialogFlows, ...charityDialogFlows };
        break;
      default:
        dialogFlows = { ...baseDialogFlows, ...guestDialogFlows };
    }

    // Guest: if user asked for support, prompt for phone instead of regular message
    if (userRole === "guest" && response.flow === "support") {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text:
              "🙋 Please enter your Egyptian mobile number so a support agent can contact you.\n\nيرجى إدخال رقم هاتفك من أجل تواصل الدعم معك.",
            sender: "bot",
            timestamp: new Date()
          }
        ]);
        setExpectingPhone(true);
      }, 500);
      return;
    }

    // Add bot response after a short delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: dialogFlows[response.flow].en + "\n\n" + dialogFlows[response.flow].ar,
        sender: 'bot' as const,
        timestamp: new Date(),
        options: response.options
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const handleOptionClick = (optionValue: string) => {
    // Get the appropriate dialog flows based on user role
    let dialogFlows;
    switch(userRole) {
      case "charity":
        dialogFlows = { ...baseDialogFlows, ...charityDialogFlows };
        break;
      case "guest":
        dialogFlows = { ...baseDialogFlows, ...guestDialogFlows };
        break;
      case "organization":
        dialogFlows = { ...baseDialogFlows, ...organizationDialogFlows };
        break;
      case "admin":
        dialogFlows = { ...baseDialogFlows, ...charityDialogFlows };
        break;
      default:
        dialogFlows = { ...baseDialogFlows, ...guestDialogFlows };
    }

    // If guest and optionValue is support, prompt for phone number
    if (userRole === "guest" && optionValue === "support") {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: "🙋 Contact Support",
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text:
              "🙋 Please enter your Egyptian mobile number so a support agent can contact you.\n\nيرجى إدخال رقم هاتفك من أجل تواصل الدعم معك.",
            sender: "bot",
            timestamp: new Date()
          }
        ]);
        setExpectingPhone(true);
      }, 500);
      setInput('');
      return;
    }

    // Standard option click: add user's selected option as message
    let selectedOption: ChatOption | undefined;
    for (const flow of Object.values(dialogFlows)) {
      if ((flow as any).options) {
        const found = (flow as any).options.find((option: ChatOption) => option.value === optionValue);
        if (found) {
          selectedOption = found;
          break;
        }
      }
    }
    if (!selectedOption) {
      selectedOption = { id: optionValue, text: optionValue, value: optionValue };
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: selectedOption.text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Handle special case for "back"
    const flow = optionValue === 'back' ? 'mainGreeting' : optionValue;
    const flowKey = flow as keyof typeof dialogFlows;
    const options = dialogFlows[flowKey]?.options || [];

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: dialogFlows[flowKey].en + "\n\n" + dialogFlows[flowKey].ar,
        sender: 'bot' as const,
        timestamp: new Date(),
        options: options
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
    setInput('');
  };

  return (
    <Card className="flex flex-col h-[500px] w-full">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map(message => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[80%]`}>
                <Avatar className="h-8 w-8 border">
                  <div className="flex h-full w-full items-center justify-center bg-charity-primary text-white font-semibold">
                    {message.sender === 'user' ? 'U' : 'B'}
                  </div>
                </Avatar>
                <div 
                  className={`rounded-lg px-4 py-2 ${
                    message.sender === 'user' 
                      ? 'bg-charity-primary text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                  
                  {message.options && message.options.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.options.map(option => (
                        <Button
                          key={option.id}
                          size="sm"
                          variant="outline"
                          className="text-xs bg-white hover:bg-gray-50"
                          onClick={() => handleOptionClick(option.value)}
                        >
                          {option.text}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <form 
        onSubmit={handleSendMessage}
        className="border-t p-4 flex items-center gap-2"
      >
        <Input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError('');
          }}
          placeholder={
            expectingPhone && userRole === "guest"
              ? "Enter your Egyptian mobile number"
              : "Type your message..."
          }
          className={expectingPhone && error ? "flex-1 border-red-500" : "flex-1"}
          inputMode={expectingPhone ? "numeric" : undefined}
          pattern={expectingPhone ? "^(010|011|012|015)[0-9]{8}$" : undefined}
          maxLength={expectingPhone ? 11 : undefined}
        />
        <Button 
          type="submit"
          size="icon"
          className="bg-charity-primary hover:bg-charity-dark"
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </form>
      {expectingPhone && error && (
        <div className="text-red-500 text-xs px-4 pb-2 -mt-2">
          {error}
        </div>
      )}
    </Card>
  );
}
