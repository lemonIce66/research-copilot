from langchain_core.messages import SystemMessage, AIMessage, HumanMessage
from src.agents.state import AgentState
from src.services.llm_service import get_llm

ANALYST_PROMPT = """You are an Analyst Agent. Your job is to:
1. Read and analyze the research findings
2. Extract key insights, patterns, and trends
3. Identify strengths and weaknesses in the evidence
4. Provide a structured analysis

Format your analysis with clear sections:
- Key Findings
- Trends & Patterns
- Critical Analysis
- Implications
"""


def analyst_node(state: AgentState) -> dict:
    llm = get_llm(temperature=0.4)

    research = state.get("research_results", "")
    context_docs = state.get("context_docs", "")

    analysis_input = f"Research findings:\n{research}"
    if context_docs:
        analysis_input += f"\n\nAdditional context from uploaded documents:\n{context_docs}"

    messages = [
        SystemMessage(content=ANALYST_PROMPT),
        HumanMessage(content=f"{analysis_input}\n\nProvide a thorough analysis."),
    ]

    response = llm.invoke(messages)

    return {
        "messages": [AIMessage(content=response.content, name="analyst")],
        "analysis": response.content,
        "sender": "analyst",
    }
