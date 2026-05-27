from tavily import TavilyClient
from src.core.config import settings


def tavily_search(query: str, max_results: int = 5) -> str:
    if not settings.TAVILY_API_KEY:
        return f"[Search unavailable - no TAVILY_API_KEY configured. Query was: {query}]"

    try:
        client = TavilyClient(api_key=settings.TAVILY_API_KEY)
        response = client.search(query=query, max_results=max_results)

        results = []
        for item in response.get("results", []):
            results.append(f"**{item['title']}**\n{item['content']}\nSource: {item['url']}")

        return "\n\n---\n\n".join(results) if results else "No results found."
    except Exception as e:
        return f"[Search error: {str(e)}]"
