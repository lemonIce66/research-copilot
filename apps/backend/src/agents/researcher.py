from langchain_core.messages import SystemMessage, AIMessage, HumanMessage
from src.agents.state import AgentState
from src.services.llm_service import get_llm
from src.services.search_service import tavily_search

RESEARCHER_PROMPT = """You are a Research Agent. Your job is to search the web for relevant, up-to-date information.

Given the research task, use the search tool to find:
- Recent papers, articles, and news
- Key facts and statistics
- Expert opinions and analysis

Summarize your findings clearly. Be thorough but concise.
"""


def researcher_node(state: AgentState) -> dict:
    llm = get_llm(temperature=0.5)

    task = state.get("task", "")
    if not task:
        for msg in reversed(state["messages"]):
            if isinstance(msg, HumanMessage):
                task = msg.content
                break

    search_results = tavily_search(task)

    messages = [
        SystemMessage(content=RESEARCHER_PROMPT),
        HumanMessage(content=f"Research task: {task}\n\nSearch results:\n{search_results}\n\nProvide a comprehensive summary of the findings."),
    ]

    response = llm.invoke(messages)

    return {
        "messages": [AIMessage(content=response.content, name="researcher")],
        "research_results": response.content,
        "sender": "researcher",
    }
