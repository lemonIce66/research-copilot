import json
import asyncio
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from langchain_core.messages import AIMessage, HumanMessage
from src.agents.graph import graph
from src.services.rag_service import retrieve_documents

router = APIRouter()


@router.post("/chat/stream")
async def chat_stream(request: Request):
    body = await request.json()
    task = body.get("message", "")
    session_id = body.get("session_id", "default")

    context_docs = retrieve_documents(session_id, task)

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

    async def event_generator():
        try:
            async for event in graph.astream_events(initial_state, version="v2"):
                kind = event.get("event", "")

                if kind == "on_chain_start":
                    node_name = event.get("name", "")
                    if node_name in ("supervisor", "researcher", "analyst", "writer"):
                        yield f"data: {json.dumps({'type': 'step', 'agent': node_name})}\n\n"

                elif kind == "on_chat_model_stream":
                    chunk = event.get("data", {}).get("chunk", None)
                    if chunk and hasattr(chunk, "content") and chunk.content:
                        yield f"data: {json.dumps({'type': 'token', 'content': chunk.content})}\n\n"

                elif kind == "on_chain_end":
                    node_name = event.get("name", "")
                    if node_name == "writer":
                        output = event.get("data", {}).get("output", {})
                        if isinstance(output, dict) and "report" in output:
                            yield f"data: {json.dumps({'type': 'report', 'content': output['report']})}\n\n"

            yield f"data: {json.dumps({'type': 'done'})}\n\n"

        except Exception as e:
            import traceback
            error_detail = traceback.format_exc()
            print(f"ERROR in chat stream: {error_detail}")
            yield f"data: {json.dumps({'type': 'error', 'content': f'{type(e).__name__}: {str(e)}'})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
