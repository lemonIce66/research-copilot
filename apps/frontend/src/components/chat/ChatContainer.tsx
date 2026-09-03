"use client";
import { useEffect, useRef } from "react";
import { useChat } from "@/hooks/useChat";
import { useChatStore } from "@/hooks/useChatStore";
import { useTranslation } from "@/lib/i18n";
import { MessageBubble } from "./MessageBubble";
import { ThinkingProcess } from "./ThinkingProcess";
import { ChatInput } from "./ChatInput";
import { Bot, Trash2 } from "lucide-react";

export function ChatContainer() {
  const { messages, steps, isLoading, currentAgent, sendMessage, uploadFile, clearChat } =
    useChat();
  const t = useTranslation();
  const language = useChatStore((s) => s.language);
  const toggleLanguage = useChatStore((s) => s.toggleLanguage);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, steps]);

  const handleUpload = async (file: File) => {
    try {
      const result = await uploadFile(file);
      sendMessage(
        t.uploadedPrompt
          .replace("{filename}", result.filename)
          .replace("{chunks}", String(result.chunks))
      );
    } catch {
      alert(t.uploadFailed);
    }
  };

  return (
    <div className="flex flex-col h-screen" translate="no">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Bot size={18} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">{t.title}</h1>
            <p className="text-xs text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-lg border border-border text-xs font-medium hover:bg-accent transition-colors"
            title={language === "zh" ? "Switch to English" : "切换到中文"}
          >
            {language === "zh" ? "EN" : "中文"}
          </button>
          <button
            onClick={clearChat}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            title={t.clearChat}
          >
            <Trash2 size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Bot size={32} className="text-primary" />
            </div>
            <h2 className="text-lg font-semibold mb-2">{t.welcomeTitle}</h2>
            <p className="text-sm text-muted-foreground max-w-md">{t.welcomeDesc}</p>
            <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
              <div className="px-3 py-2 rounded-lg border border-border">
                <span className="text-purple-400 font-medium">{t.supervisor}</span>
                <p className="text-muted-foreground">{t.supervisorDesc}</p>
              </div>
              <div className="px-3 py-2 rounded-lg border border-border">
                <span className="text-blue-400 font-medium">{t.researcher}</span>
                <p className="text-muted-foreground">{t.researcherDesc}</p>
              </div>
              <div className="px-3 py-2 rounded-lg border border-border">
                <span className="text-green-400 font-medium">{t.analyst}</span>
                <p className="text-muted-foreground">{t.analystDesc}</p>
              </div>
              <div className="px-3 py-2 rounded-lg border border-border">
                <span className="text-orange-400 font-medium">{t.writer}</span>
                <p className="text-muted-foreground">{t.writerDesc}</p>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === "assistant" && (
              <ThinkingProcess steps={steps} currentAgent={currentAgent} />
            )}
            <MessageBubble message={msg} />
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.content === "" && (
          <ThinkingProcess steps={steps} currentAgent={currentAgent} />
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} onUpload={handleUpload} isLoading={isLoading} />
    </div>
  );
}
