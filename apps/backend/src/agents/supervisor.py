from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from src.agents.state import AgentState
from src.services.llm_service import get_structured_llm

MAX_ITERATIONS = 6

SUPERVISOR_PROMPT = """You are the Supervisor of a research team. Your job is to:
1. Understand the user's research task
2. Decide which team member should work next
3. Coordinate the workflow until the task is complete

Team members:
- **researcher**: Searches the web for latest information, papers, and news
- **analyst**: Analyzes content, extracts key insights, compares findings
- **writer**: Compiles findings into a polished markdown report

Routing rules:
- For new tasks, start with the researcher
- After research is gathered, send to the analyst
- After analysis is done, send to the writer
- When the report is complete, respond with "FINISH"

Respond with ONLY one of these words: researcher, analyst, writer, FINISH
"""


def supervisor_node(state: AgentState) -> dict:
    iteration = state.get("iteration", 0) + 1

    if iteration > MAX_ITERATIONS:
        return {"next": "FINISH", "sender": "supervisor", "iteration": iteration}

    has_report = bool(state.get("report", ""))
    has_analysis = bool(state.get("analysis", ""))
    has_research = bool(state.get("research_results", ""))

    if has_report:
        return {"next": "FINISH", "sender": "supervisor", "iteration": iteration}

    if has_analysis and not has_report:
        return {"next": "writer", "sender": "supervisor", "iteration": iteration}

    if has_research and not has_analysis:
        return {"next": "analyst", "sender": "supervisor", "iteration": iteration}

    llm = get_structured_llm(temperature=0.3)
    messages = [SystemMessage(content=SUPERVISOR_PROMPT)] + state["messages"]
    response = llm.invoke(messages)

    decision = response.content.strip().lower()

    if "finish" in decision:
        return {"next": "FINISH", "sender": "supervisor", "iteration": iteration}

    valid_next = {"researcher", "analyst", "writer"}
    for agent in valid_next:
        if agent in decision:
            return {"next": agent, "sender": "supervisor", "iteration": iteration}

    return {"next": "researcher", "sender": "supervisor", "iteration": iteration}
