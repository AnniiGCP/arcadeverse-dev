import { Chatbot } from "@/components/Chatbot";
import { crispHelpers } from "@/components/CrispChat";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import { useNotification } from "@/lib/notification-provider";
import {
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconChevronDown,
  IconMailFilled,
  IconMessageCircle,
  IconRobot,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useCallback, useEffect, useState } from "react";

import { type FAQItemData, faqItems } from "@/data/faqData";
import { apiPath } from "@/lib/api";

// Individual FAQ Item Component - Memoized for performance, fully accessible and smooth animation
const FAQItem = memo(({ faq, index }: { faq: FAQItemData; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerId = `faq-trigger-${faq.id || index}`;
  const contentId = `faq-content-${faq.id || index}`;

  return (
    <div className="rounded-xl border border-border bg-surface-card transition-colors hover:border-border-strong overflow-hidden shadow-card-premium dark:border-white/10 dark:bg-[#171d2d] dark:hover:border-white/20">
      <h3>
        <button
          id={triggerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full px-5 py-4 sm:px-6 sm:py-5 flex justify-between items-center gap-4 text-left transition-colors hover:bg-surface-hover/50 dark:hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
        >
          <span className="font-semibold text-sm sm:text-base text-foreground dark:text-white leading-snug">
            {faq.question}
          </span>
          <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-surface-hover dark:bg-white/5 text-muted-foreground transition-colors">
            <IconChevronDown
              className={`h-4 w-4 text-primary transition-transform duration-300 ease-in-out ${
                isOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </span>
        </button>
      </h3>
      <div
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-1 sm:px-6 sm:pb-6 text-sm sm:text-base leading-relaxed text-muted-foreground dark:text-slate-300 border-t border-border dark:border-white/5">
            {faq.answer}
          </div>
        </div>
      </div>
    </div>
  );
});

FAQItem.displayName = "FAQItem";

export function SupportPage() {
  const { user } = useAuth();
  const { success, error, notifySupportMessage } = useNotification();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: "",
    website_hp: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const scriptId = "support-faq-schema";
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    };

    const script = document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const current = document.getElementById(scriptId);
      if (current) current.remove();
    };
  }, []);

  const handleStartAIChat = useCallback(() => {
    setIsChatOpen(true);
  }, []);

  const handleStartLiveChat = useCallback(() => {
    // Set user info if available
    if (user?.email) {
      crispHelpers.setUserEmail(user.email);
    }
    if (user?.name) {
      crispHelpers.setUserNickname(user.name);
    }
    // Open Crisp chat
    const opened = crispHelpers.open();
    if (!opened) {
      notifySupportMessage(
        "Connecting you to AI Assistant while live agent initializes...",
        "Support Center",
      );
      setIsChatOpen(true);
    }
  }, [user?.email, user?.name, notifySupportMessage]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!formData.name.trim()) {
      error("Please enter your name");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      error("Please enter a valid email address");
      return;
    }

    if (!formData.subject.trim()) {
      error("Please enter a subject");
      return;
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      error("Please enter a message with at least 10 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(apiPath("/api/support"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          website_hp: formData.website_hp,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit support request");
      }

      success("Your support request has been submitted", {
        description: "We'll get back to you as soon as possible.",
      });

      // Send a support team acknowledgment notification
      setTimeout(() => {
        notifySupportMessage(
          "Thank you for contacting us! We've received your request and will respond within 24 hours.",
          "Support Team",
        );
      }, 3000);

      // Reset form
      setFormData((prev) => ({
        ...prev,
        subject: "",
        message: "",
      }));
    } catch (err: any) {
      error("Failed to submit your request", {
        description:
          err?.message || "Please try again later or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-12 max-w-5xl mx-auto pt-20">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Support Center</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get help with your ArcadeVerse experience. Browse our FAQ or contact
            our support team.
          </p>
        </div>

        {/* Email and Chat Support Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Email Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IconMailFilled className="mr-2 h-5 w-5" />
                Email Support
              </CardTitle>
              <CardDescription>
                Send us a detailed message and we'll get back to you within 24
                hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field for bot spam prevention */}
                <input
                  type="text"
                  name="website_hp"
                  value={formData.website_hp}
                  onChange={handleInputChange}
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Describe your issue or question in detail"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </CardFooter>
          </Card>

          {/* Chat Support - Hybrid Option */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IconMessageCircle className="mr-2 h-5 w-5" />
                Chat Support
              </CardTitle>
              <CardDescription>
                Choose between instant AI assistance or connect with our human
                support team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* AI Chatbot Option */}
              <div className="p-4 bg-muted/30 rounded-lg border-2 border-transparent hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-blue-500/10 rounded-full flex-shrink-0">
                    <IconRobot className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">AI Assistant</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get instant answers to common questions 24/7
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                      <span>🤖 Instant responses</span>
                      <span>� FAQ knowledge</span>
                      <span>⚡ Always available</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={handleStartAIChat}
                    >
                      <IconRobot className="mr-2 h-4 w-4" />
                      Chat with AI
                    </Button>
                  </div>
                </div>
              </div>

              {/* Human Support Option */}
              <div className="p-4 bg-muted/30 rounded-lg border-2 border-transparent hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-green-500/10 rounded-full flex-shrink-0">
                    <IconUsers className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Human Support</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Connect with our team for personalized assistance
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                      <span>👥 Real people</span>
                      <span>💬 Live chat</span>
                      <span>🎯 Personalized help</span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={handleStartLiveChat}
                    >
                      <IconUsers className="mr-2 h-4 w-4" />
                      Talk to Support
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Channels Banner */}
        <div className="rounded-2xl border border-border/80 bg-surface-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-lg font-bold text-foreground dark:text-white flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Join the ArcadeVerse Community
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Connect with fellow Google Cloud learners, ask questions, get
              instant milestone updates, and troubleshoot labs together in
              real-time.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href="https://chat.whatsapp.com/LVC3Jdrx3VYB5JIKYCUpZo?s=sw&p=i&mlu=4&ilr=4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
            >
              <IconBrandWhatsapp className="h-4 w-4" />
              <span>WhatsApp Group</span>
            </a>
            <a
              href="https://t.me/ArcadeVerse"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
            >
              <IconBrandTelegram className="h-4 w-4" />
              <span>Telegram Channel</span>
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <section aria-labelledby="faq-heading" className="space-y-6 pt-4">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2
              id="faq-heading"
              className="text-3xl font-bold tracking-tight text-foreground dark:text-white"
            >
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Everything you need to know about calculating Google Cloud Arcade
              points, tracking Google Cloud skill badges, understanding
              milestone rewards, and checking swag eligibility with ArcadeVerse.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3 mt-8">
            {faqItems.map((faq, index) => (
              <FAQItem key={faq.id} faq={faq} index={index} />
            ))}
          </div>
        </section>
      </div>

      {/* AI Chatbot Floating Widget */}
      {isChatOpen && (
        <div className="fixed bottom-4 left-4 z-50 w-[420px] max-w-[calc(100vw-2rem)] shadow-2xl">
          <Card className="border border-border bg-surface-card shadow-2xl backdrop-blur-xl rounded-2xl overflow-hidden dark:border-white/15 dark:bg-[#121724]">
            <CardHeader className="py-3 px-4 bg-gradient-to-r from-purple-100/80 via-indigo-50/80 to-purple-100/50 dark:from-purple-900/50 dark:via-[#182035] dark:to-[#121724] border-b border-border dark:border-white/10 text-foreground dark:text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-700 dark:text-purple-300">
                    <IconRobot className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-foreground dark:text-white flex items-center gap-1.5">
                      ArcadeVerse AI Assistant
                    </CardTitle>
                    <CardDescription className="text-muted-foreground dark:text-slate-400 text-[11px]">
                      Instant answers • Groq & Arcade knowledge base
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg hover:bg-surface-hover text-muted-foreground hover:text-foreground dark:hover:bg-white/10 dark:text-slate-400 dark:hover:text-white"
                  onClick={() => setIsChatOpen(false)}
                  aria-label="Close AI Assistant"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Chatbot onClose={() => setIsChatOpen(false)} />
            </CardContent>
            <div className="px-4 py-2 text-center bg-surface-hover/50 dark:bg-[#0e131d] border-t border-border dark:border-white/5">
              <Button
                variant="link"
                size="sm"
                className="text-xs text-muted-foreground hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-300 p-0 h-auto"
                onClick={() => {
                  setIsChatOpen(false);
                  handleStartLiveChat();
                }}
              >
                Need human help? Talk to support team →
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
