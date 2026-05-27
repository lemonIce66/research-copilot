"use client";
import { AgentStep } from "@/hooks/useChatStore";

const agentLabels: Record<string, string> = {
  supervisor: "Supervisor is analyzing the task...",
  researcher: "Researcher is searching the web...",
  analyst: "Analyst is analyzing findings...",
  writer: "Writer is compiling the report...",
};

const agentColors: Record<string, string> = {
  supervisor: "text-purple-400",
  researcher: "text-blue-400",
  analyst: "text-green-400",
  writer: "text-orange-400",
};

export function ThinkingProcess({
  steps,
  currentAgent,
}: {
  steps: AgentStep[];
  currentAgent: string | null;
}) {
  if (steps.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5 mb-3">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-dot" />
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-dot" />
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-dot" />
          </div>
          <span className={agentColors[step.agent] || "text-muted-foreground"}>
            {agentLabels[step.agent] || `${step.agent} is working...`}
          </span>
        </div>
      ))}
    </div>
  );
}
