import { create } from "zustand";

// crypto.randomUUID only exists in secure contexts (HTTPS / localhost).
// Fall back to a random ID when served over plain HTTP, e.g. http://<server-ip>.
function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  agentName?: string;
  timestamp: number;
}

export interface AgentStep {
  agent: string;
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  steps: AgentStep[];
  isLoading: boolean;
  currentAgent: string | null;
  darkMode: boolean;
  language: "zh" | "en";
  sessionId: string;

  addMessage: (msg: Omit<Message, "id" | "timestamp">) => void;
  appendToLastMessage: (content: string) => void;
  replaceLastMessage: (content: string) => void;
  addStep: (agent: string) => void;
  setLoading: (loading: boolean) => void;
  setCurrentAgent: (agent: string | null) => void;
  toggleDarkMode: () => void;
  toggleLanguage: () => void;
  clearChat: () => void;
  setSessionId: (id: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  steps: [],
  isLoading: false,
  currentAgent: null,
  darkMode: true,
  language: "zh",
  sessionId: "default",

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...msg, id: generateId(), timestamp: Date.now() },
      ],
    })),

  appendToLastMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      const last = messages[messages.length - 1];
      if (last && last.role === "assistant") {
        last.content += content;
      }
      return { messages };
    }),

  replaceLastMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      const last = messages[messages.length - 1];
      if (last && last.role === "assistant") {
        last.content = content;
      }
      return { messages };
    }),

  addStep: (agent) =>
    set((state) => ({
      steps: [...state.steps, { agent, timestamp: Date.now() }],
      currentAgent: agent,
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setCurrentAgent: (currentAgent) => set({ currentAgent }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  toggleLanguage: () =>
    set((state) => ({ language: state.language === "zh" ? "en" : "zh" })),

  clearChat: () =>
    set({
      messages: [],
      steps: [],
      isLoading: false,
      currentAgent: null,
    }),

  setSessionId: (sessionId) => set({ sessionId }),
}));
