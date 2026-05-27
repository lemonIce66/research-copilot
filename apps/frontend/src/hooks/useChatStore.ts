import { create } from "zustand";

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
  sessionId: string;

  addMessage: (msg: Omit<Message, "id" | "timestamp">) => void;
  appendToLastMessage: (content: string) => void;
  addStep: (agent: string) => void;
  setLoading: (loading: boolean) => void;
  setCurrentAgent: (agent: string | null) => void;
  toggleDarkMode: () => void;
  clearChat: () => void;
  setSessionId: (id: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  steps: [],
  isLoading: false,
  currentAgent: null,
  darkMode: true,
  sessionId: "default",

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...msg, id: crypto.randomUUID(), timestamp: Date.now() },
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

  addStep: (agent) =>
    set((state) => ({
      steps: [...state.steps, { agent, timestamp: Date.now() }],
      currentAgent: agent,
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setCurrentAgent: (currentAgent) => set({ currentAgent }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  clearChat: () =>
    set({
      messages: [],
      steps: [],
      isLoading: false,
      currentAgent: null,
    }),

  setSessionId: (sessionId) => set({ sessionId }),
}));
