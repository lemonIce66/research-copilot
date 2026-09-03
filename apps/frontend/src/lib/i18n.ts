import { useChatStore } from "@/hooks/useChatStore";

export type Language = "zh" | "en";

export interface Translation {
  title: string;
  subtitle: string;
  clearChat: string;
  welcomeTitle: string;
  welcomeDesc: string;
  supervisor: string;
  researcher: string;
  analyst: string;
  writer: string;
  supervisorDesc: string;
  researcherDesc: string;
  analystDesc: string;
  writerDesc: string;
  supervisorThinking: string;
  researcherThinking: string;
  analystThinking: string;
  writerThinking: string;
  uploadPdf: string;
  placeholder: string;
  uploadFailed: string;
  uploadedPrompt: string;
}

export const translations: Record<Language, Translation> = {
  zh: {
    title: "科研助手",
    subtitle: "多智能体科研助手",
    clearChat: "清空对话",
    welcomeTitle: "欢迎使用 Research Co-Pilot",
    welcomeDesc:
      "我是一个多智能体科研助手。让我研究任何主题，我会派出智能体团队来搜索、分析，并为你撰写一份全面的报告。",
    supervisor: "主管",
    researcher: "研究员",
    analyst: "分析师",
    writer: "撰稿人",
    supervisorDesc: "协调团队",
    researcherDesc: "搜索网络",
    analystDesc: "提取洞察",
    writerDesc: "撰写报告",
    supervisorThinking: "主管正在分析任务…",
    researcherThinking: "研究员正在搜索网络…",
    analystThinking: "分析师正在分析发现…",
    writerThinking: "撰稿人正在撰写报告…",
    uploadPdf: "上传 PDF",
    placeholder: "让我研究任何主题…（Shift+Enter 换行）",
    uploadFailed: "文件上传失败，请确认后端正在运行。",
    uploadedPrompt:
      "我已上传 PDF 文档「{filename}」，共 {chunks} 个片段，请分析它。",
  },
  en: {
    title: "Research Co-Pilot",
    subtitle: "Multi-agent research assistant",
    clearChat: "Clear chat",
    welcomeTitle: "Welcome to Research Co-Pilot",
    welcomeDesc:
      "I'm a multi-agent research assistant. Ask me to research any topic, and I'll deploy my team of agents to search, analyze, and compile a comprehensive report for you.",
    supervisor: "Supervisor",
    researcher: "Researcher",
    analyst: "Analyst",
    writer: "Writer",
    supervisorDesc: "Coordinates the team",
    researcherDesc: "Searches the web",
    analystDesc: "Extracts insights",
    writerDesc: "Compiles reports",
    supervisorThinking: "Supervisor is analyzing the task...",
    researcherThinking: "Researcher is searching the web...",
    analystThinking: "Analyst is analyzing findings...",
    writerThinking: "Writer is compiling the report...",
    uploadPdf: "Upload PDF",
    placeholder: "Ask me to research anything... (Shift+Enter for new line)",
    uploadFailed: "Failed to upload file. Make sure the backend is running.",
    uploadedPrompt:
      'I\'ve uploaded a PDF document "{filename}" with {chunks} chunks. Please analyze it.',
  },
};

export function useTranslation(): Translation {
  const language = useChatStore((s) => s.language);
  return translations[language];
}
