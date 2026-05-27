from langgraph.graph import StateGraph, END
from src.agents.state import AgentState
from src.agents.supervisor import supervisor_node
from src.agents.researcher import researcher_node
from src.agents.analyst import analyst_node
from src.agents.writer import writer_node
from langchain_core.messages import HumanMessage


def route_supervisor(state: AgentState) -> str:
    next_agent = state.get("next", "FINISH")
    if next_agent == "FINISH":
        return END
    return next_agent


def build_graph():
    workflow = StateGraph(AgentState)

    workflow.add_node("supervisor", supervisor_node)
    workflow.add_node("researcher", researcher_node)
    workflow.add_node("analyst", analyst_node)
    workflow.add_node("writer", writer_node)

    workflow.set_entry_point("supervisor")

    workflow.add_conditional_edges(
        "supervisor",
        route_supervisor,
        {
            "researcher": "researcher",
            "analyst": "analyst",
            "writer": "writer",
            END: END,
        },
    )

    workflow.add_edge("researcher", "supervisor")
    workflow.add_edge("analyst", "supervisor")
    workflow.add_edge("writer", "supervisor")

    return workflow.compile()


graph = build_graph()


async def run_research(task: str, context_docs: str = ""):
    initial_state = {
        "messages": [HumanMessage(content=task)],
        "task": task,
        "sender": "user",
        "next": "",
        "research_results": "",
        "analysis": "",
        "report": "",
        "context_docs": context_docs,
        "iteration": 0,
    }

    return await graph.ainvoke(initial_state)
