import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiPath } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  IconAlertCircle,
  IconCheck,
  IconCopy,
  IconExternalLink,
  IconRefresh,
  IconRobot,
  IconSend,
  IconSparkles,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isError?: boolean;
  sources?: Array<{ title: string; url: string }>;
}

const SUGGESTED_PROMPTS = [
  "How are Arcade points calculated?",
  "Why isn't my skill badge showing?",
  "What are the Arcade milestone tiers?",
  "What is Google Cloud Run?",
];

interface ChatbotProps {
  className?: string;
  onClose?: () => void;
}

export function Chatbot({ className }: ChatbotProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: `Hello${user?.name ? " " + user.name : ""}! 👋 I'm your **ArcadeVerse AI Assistant**.\n\nI can help you with Google Cloud Arcade rules, points calculation, skill badges, swags, and general Google Cloud concepts.\n\nHow can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "end",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleCopyMessage = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-" + Date.now(),
        role: "assistant",
        content: `Chat cleared! ✨ What else would you like to know about ArcadeVerse or Google Cloud?`,
        timestamp: new Date(),
      },
    ]);
    setInputMessage("");
  };

  const sendMessage = async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    // Format past messages for the backend (excluding initial welcome banner to save tokens)
    const payloadMessages = newMessages
      .filter((m) => !m.isError)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    try {
      const response = await fetch(apiPath("/api/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed to get response from AI Assistant.",
        );
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.message || "No response generated.",
        timestamp: new Date(),
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Chatbot error:", error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          error?.message ||
          "Sorry, something went wrong while connecting to the assistant. Please try again.",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Re-focus input on desktop
      if (window.innerWidth > 768) {
        inputRef.current?.focus();
      }
    }
  };

  const handleRetryLast = () => {
    // Find the last user message
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user");
    if (lastUserMessage) {
      // Remove any trailing error message
      setMessages((prev) => prev.filter((m) => !m.isError));
      sendMessage(lastUserMessage.content);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  // Check if current view is initial (only 1 welcome message)
  const isInitialState =
    messages.length === 1 && messages[0].role === "assistant";

  return (
    <div
      className={`flex flex-col h-[520px] max-h-[80vh] bg-surface-card rounded-xl text-foreground dark:bg-[#111622] dark:text-slate-100 ${className || ""}`}
    >
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border dark:border-white/10 text-xs text-muted-foreground bg-surface-hover/70 dark:bg-[#141b2c]/80 backdrop-blur rounded-t-xl">
        <div className="flex items-center gap-1.5 font-medium text-foreground dark:text-slate-300">
          <IconSparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
          <span>Powered by Groq • LLaMA 3.3</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleClearChat}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-surface-hover dark:hover:bg-white/10 text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            title="Clear chat history"
          >
            <IconTrash className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isUser = message.role === "user";
            const isCopied = copiedId === message.id;

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs shadow-sm ${
                    isUser
                      ? "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white"
                      : message.isError
                        ? "bg-red-500/20 text-red-500 border border-red-500/30"
                        : "bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30"
                  }`}
                >
                  {isUser ? (
                    <IconUser className="w-4 h-4" />
                  ) : message.isError ? (
                    <IconAlertCircle className="w-4 h-4" />
                  ) : (
                    <IconRobot className="w-4 h-4" />
                  )}
                </div>

                {/* Message Content Bubble */}
                <div
                  className={`relative group max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-sm"
                      : message.isError
                        ? "bg-red-500/10 border border-red-500/30 text-red-700 dark:bg-red-950/40 dark:text-red-200 rounded-tl-sm"
                        : "bg-surface-hover/80 border border-border text-foreground dark:bg-[#1a2236] dark:border-white/10 dark:text-slate-200 rounded-tl-sm"
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  ) : (
                    <div className="prose prose-sm max-w-none text-foreground dark:text-slate-200 dark:prose-invert break-words space-y-2">
                      <ReactMarkdown
                        components={{
                          a: ({ ...props }) => (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:text-purple-300 underline font-medium inline-flex items-center gap-0.5"
                            >
                              <span>{props.children}</span>
                              <IconExternalLink className="w-3 h-3 inline ml-0.5 opacity-70" />
                            </a>
                          ),
                          code: ({ className, children, ...props }) => {
                            const isInline =
                              !className &&
                              typeof children === "string" &&
                              !children.includes("\n");
                            if (isInline) {
                              return (
                                <code
                                  className="bg-surface-hover text-purple-700 dark:text-purple-300 dark:bg-black/40 px-1.5 py-0.5 rounded text-xs font-mono"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            }
                            return (
                              <div className="my-2 rounded-lg overflow-x-auto bg-surface-hover border border-border text-emerald-700 dark:bg-black/60 dark:border-white/10 dark:text-emerald-300 p-2.5 text-xs font-mono">
                                <code>{children}</code>
                              </div>
                            );
                          },
                          p: ({ ...props }) => (
                            <p
                              className="mb-2 last:mb-0 leading-relaxed text-foreground dark:text-slate-200"
                              {...props}
                            />
                          ),
                          ul: ({ ...props }) => (
                            <ul
                              className="list-disc pl-4 space-y-1 mb-2 text-foreground dark:text-slate-200"
                              {...props}
                            />
                          ),
                          ol: ({ ...props }) => (
                            <ol
                              className="list-decimal pl-4 space-y-1 mb-2 text-foreground dark:text-slate-200"
                              {...props}
                            />
                          ),
                          li: ({ ...props }) => (
                            <li className="pl-0.5" {...props} />
                          ),
                          h3: ({ ...props }) => (
                            <h3
                              className="font-semibold text-foreground dark:text-white text-sm mt-3 mb-1.5 flex items-center gap-1"
                              {...props}
                            />
                          ),
                          h4: ({ ...props }) => (
                            <h4
                              className="font-medium text-foreground dark:text-slate-100 text-xs mt-2 mb-1"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>

                      {/* Display live verified sources if any */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-border dark:border-white/10 text-xs text-muted-foreground dark:text-slate-400 space-y-1">
                          <span className="font-medium text-foreground dark:text-slate-300 flex items-center gap-1">
                            <IconExternalLink className="w-3 h-3 text-purple-500 dark:text-purple-400" />
                            Sources & Official References:
                          </span>
                          <ul className="space-y-0.5 pl-2">
                            {message.sources.map((s, idx) => (
                              <li key={idx} className="truncate">
                                <a
                                  href={s.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-600 dark:text-purple-400 hover:underline text-[11px]"
                                >
                                  {s.title || s.url}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Footer: Timestamp + Copy Button */}
                  <div className="flex items-center justify-between gap-3 mt-1.5 pt-1 text-[10px] text-muted-foreground dark:text-slate-400/80 border-t border-border/60 dark:border-white/5">
                    <span>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    {!isUser && !message.isError && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyMessage(message.id, message.content)
                        }
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-surface-hover dark:hover:bg-white/10 text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                        title="Copy response"
                      >
                        {isCopied ? (
                          <>
                            <IconCheck className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                            <span className="text-emerald-500 dark:text-emerald-400">
                              Copied
                            </span>
                          </>
                        ) : (
                          <>
                            <IconCopy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}

                    {message.isError && (
                      <button
                        type="button"
                        onClick={handleRetryLast}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-300 hover:bg-red-500/20 transition-colors"
                      >
                        <IconRefresh className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Loading / Typing Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2.5"
          >
            <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <IconRobot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-surface-hover/80 border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm dark:bg-[#1a2236] dark:border-white/10">
              <span
                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
              <span className="text-xs text-muted-foreground dark:text-slate-400 ml-2">
                Thinking...
              </span>
            </div>
          </motion.div>
        )}

        {/* Suggested Prompts when empty / on start */}
        {isInitialState && !isLoading && (
          <div className="pt-2 pb-1 space-y-2">
            <p className="text-xs font-medium text-muted-foreground dark:text-slate-400 flex items-center gap-1.5">
              <IconSparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
              Suggested questions:
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="text-left px-3 py-2 rounded-lg bg-surface-hover border border-border hover:border-purple-500/40 text-xs text-foreground hover:text-purple-600 dark:bg-[#161e31] dark:hover:bg-[#1d2740] dark:border-white/10 dark:text-slate-300 dark:hover:text-white transition-all duration-150 flex items-center justify-between group shadow-sm"
                >
                  <span>{prompt}</span>
                  <span className="text-purple-500 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-3 border-t border-border bg-surface-card/90 dark:border-white/10 dark:bg-[#141b2c]/90 rounded-b-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputMessage);
          }}
          className="flex items-center gap-2"
        >
          <Input
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about points, badges, swags, or GCP..."
            disabled={isLoading}
            maxLength={2000}
            className="flex-1 bg-surface-hover/60 border-border text-foreground placeholder:text-muted-foreground text-xs sm:text-sm h-10 focus-visible:ring-purple-500/40 focus-visible:border-purple-500/50 dark:bg-[#0d121c] dark:border-white/10 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <Button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            size="icon"
            className="h-10 w-10 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md disabled:opacity-40"
          >
            <IconSend className="h-4 w-4" />
          </Button>
        </form>
        <div className="mt-1.5 text-[10px] text-muted-foreground dark:text-slate-500 flex items-center justify-between px-1">
          <span>ArcadeVerse is an independent community project.</span>
          <span>Shift + Enter for multi-line</span>
        </div>
      </div>
    </div>
  );
}
