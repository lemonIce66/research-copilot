from typing import TypedDict, Annotated, List
from langgraph.graph import add_messages
from langchain_core.messages import BaseMessage


class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    sender: str
    next: str
    task: str
    research_results: str
    analysis: str
    report: str
    context_docs: str
    iteration: int
