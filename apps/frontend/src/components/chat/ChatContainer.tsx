"use client";
import { useEffect, useRef } from "react";
import { useChat } from "@/hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { ThinkingProcess } from "./ThinkingProcess";
import { ChatInput } from "./ChatInput";
import { Bot, Trash2 } from "lucide-react";

export function ChatContainer() {
  const { messages, steps, isLoading, currentAgent, sendMessage, uploadFile, clearChat } =
    useChat();
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
        `I've uploaded a PDF document "${result.filename}" with ${result.chunks} chunks. Please analyze it.`
      );
    } catch {
      alert("Failed to upload file. Make sure the backend is running.");
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
            <h1 className="font-semibold text-sm">Research Co-Pilot</h1>
            <p className="text-xs text-muted-foreground">
              Multi-agent research assistant
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          title="Clear chat"
        >
          <Trash2 size={16} className="text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Bot size={32} className="text-primary" />
            </div>
            <h2 className="text-lg font-semibold mb-2">
              Welcome to Research Co-Pilot
            </h2>
            <p className="text-sm text-muted-foreground max-w-md">
              I'm a multi-agent research assistant. Ask me to research any topic,
              and I'll deploy my team of agents to search, analyze, and compile a
              comprehensive report for you.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
              <div className="px-3 py-2 rounded-lg border border-border">
                <span className="text-purple-400 font-medium">Supervisor</span>
                <p className="text-muted-foreground">Coordinates the team</p>
              </div>
              <div className="px-3 py-2 rounded-lg border border-border">
                <span className="text-blue-400 font-medium">Researcher</span>
                <p className="text-muted-foreground">Searches the web</p>
              </div>
              <div className="px-3 py-2 rounded-lg border border-border">
                <span className="text-green-400 font-medium">Analyst</span>
                <p className="text-muted-foreground">Extracts insights</p>
              </div>
              <div className="px-3 py-2 rounded-lg border border-border">
                <span className="text-orange-400 font-medium">Writer</span>
                <p className="text-muted-foreground">Compiles reports</p>
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
