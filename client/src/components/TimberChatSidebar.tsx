import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { TIMBER_TIPS } from "./TimberTips";

interface Message {
  id: string;
  role: "user" | "timber";
  content: string;
  timestamp: Date;
}

interface TimberChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TimberChatSidebar({ isOpen, onClose }: TimberChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "timber",
      content: "Hey there! I'm Timber, your financial guide. I'm here to help you build a strong financial foundation, one log at a time. What can I help you with today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleMascotClick = () => {
    const randomTip = TIMBER_TIPS[Math.floor(Math.random() * TIMBER_TIPS.length)];
    
    const tipMessage: Message = {
      id: Date.now().toString(),
      role: "timber",
      content: `💡 Timber Tip: ${randomTip.title} - ${randomTip.message}`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, tipMessage]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate Timber's response with dam-building analogies
    setTimeout(() => {
      const responses = [
        "Great question! Let's build a solid foundation for that. Think of your budget like building a dam - you need to control the flow of water (money) to create a reservoir (savings).",
        "I see you're working on clearing some obstacles! Just like clearing logs from a stream, paying off debt takes patience and steady work. Let's create a plan together.",
        "That's a smart move! Building financial security is like constructing a strong dam - layer by layer, stick by stick. You're making excellent progress!",
        "Let me help you with that. Remember, every big project starts with gathering the right materials (information). What specific area would you like to focus on?",
        "Excellent! You're thinking like a true builder. Financial planning is all about preparing for the future - just like how we beavers prepare for winter by storing resources.",
      ];

      const timberMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "timber",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, timberMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full md:w-[480px] bg-card border-l border-border z-50 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header - Timber's Lodge Theme */}
        <div className="relative h-24 bg-gradient-to-br from-timber-navy to-timber-navy/90 border-b border-timber-green/20">
          {/* Wood grain texture overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(139, 94, 67, 0.3) 2px,
              rgba(139, 94, 67, 0.3) 4px
            )`
          }} />
          
          <div className="relative h-full flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              {/* Animated Timber Mascot - Clickable for Tips */}
              <div 
                className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-full bg-white/10 cursor-pointer hover:scale-105 transition-transform active:scale-95 group"
                onClick={handleMascotClick}
                title="Click me for a financial tip!"
              >
                <img
                  src="/mascot/timber_v2.png"
                  alt="Timber the Beaver"
                  className="w-full h-full object-cover animate-timber-bounce group-hover:animate-none"
                />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-timber-paper flex items-center gap-2">
                  Timber's Lodge
                  <Sparkles className="w-4 h-4 text-timber-green animate-timber-pulse" />
                </h2>
                <p className="text-sm text-timber-gray">Your Financial Guide</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-timber-paper hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="h-[calc(100vh-12rem)] px-6 py-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "timber" && (
                  <div className="w-8 h-8 rounded-full bg-timber-green/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img
                      src="/mascot/timber_v2.png"
                      alt="Timber"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-3 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground border border-timber-green/20"
                  )}
                >
                  {message.content}
                  <div
                    className={cn(
                      "text-xs mt-1 opacity-60",
                      message.role === "user" ? "text-right" : "text-left"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">You</span>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-timber-green/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src="/mascot/timber_v2.png"
                    alt="Timber"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3 border border-timber-green/20">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-timber-green rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-timber-green rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-timber-green rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Timber anything about your finances..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-timber-green hover:bg-timber-green/90 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            💡 Timber provides general guidance. Consult a financial advisor for personalized advice.
          </p>
        </div>
      </div>
    </>
  );
}
