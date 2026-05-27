"use client";
import { useChatStore } from "./useChatStore";

const API_URL = "https://research-copilot-production.up.railway.app";

export function useChat() {
  const store = useChatStore();

  const sendMessage = async (message: string) => {
    if (!message.trim() || store.isLoading) return;

    store.addMessage({ role: "user", content: message });
    store.addMessage({ role: "assistant", content: "" });
    store.setLoading(true);
    store.addStep("supervisor");

    try {
      const response = await fetch(`${API_URL}/api/v1/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          session_id: store.sessionId,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);

            switch (event.type) {
              case "step":
                store.addStep(event.agent);
                break;
              case "token":
                store.appendToLastMessage(event.content);
                break;
              case "report":
                break;
              case "done":
                store.setCurrentAgent(null);
                break;
              case "error":
                store.appendToLastMessage(`\n\nError: ${event.content}`);
                break;
            }
          } catch {
            // skip malformed JSON
          }
        }
      }
    } catch (error) {
      store.appendToLastMessage(
        `\n\nFailed to connect to backend. Make sure the server is running at ${API_URL}`
      );
    } finally {
      store.setLoading(false);
      store.setCurrentAgent(null);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("session_id", store.sessionId);

    try {
      const response = await fetch(`${API_URL}/api/v1/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  return {
    messages: store.messages,
    steps: store.steps,
    isLoading: store.isLoading,
    currentAgent: store.currentAgent,
    sendMessage,
    uploadFile,
    clearChat: store.clearChat,
  };
}
