from langchain_core.messages import SystemMessage, AIMessage, HumanMessage
from src.agents.state import AgentState
from src.services.llm_service import get_llm

WRITER_PROMPT = """You are a Writer Agent. Your job is to compile research findings and analysis into a polished, well-structured markdown report.

Structure the report as:
# Research Report

## Executive Summary
(Brief overview)

## Key Findings
(Main discoveries)

## Detailed Analysis
(In-depth discussion)

## Conclusion & Recommendations
(Summary and next steps)

## Sources
(References if available)

Use proper markdown formatting, bullet points, and headers. Make it professional and readable.
"""


def writer_node(state: AgentState) -> dict:
    llm = get_llm(temperature=0.6)

    research = state.get("research_results", "")
    analysis = state.get("analysis", "")
    task = state.get("task", "")

    if not task:
        for msg in reversed(state["messages"]):
            if isinstance(msg, HumanMessage):
                task = msg.content
                break

    messages = [
        SystemMessage(content=WRITER_PROMPT),
        HumanMessage(
            content=f"Original task: {task}\n\nResearch findings:\n{research}\n\nAnalysis:\n{analysis}\n\nGenerate the final report."
        ),
    ]

    response = llm.invoke(messages)

    return {
        "messages": [AIMessage(content=response.content, name="writer")],
        "report": response.content,
        "sender": "writer",
    }
