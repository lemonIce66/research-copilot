from tavily import TavilyClient
from src.core.config import settings


def tavily_search(query: str, max_results: int = 5) -> str:
    api_key = settings.TAVILY_API_KEY
    print(f"[Search] API Key: {api_key[:10]}...{api_key[-4:] if len(api_key) > 10 else 'SHORT'}")
    print(f"[Search] Query: {query}")

    if not api_key:
        return f"[Search unavailable - no TAVILY_API_KEY configured. Query was: {query}]"

    try:
        client = TavilyClient(api_key=api_key)
        response = client.search(query=query, max_results=max_results)

        results = []
        for item in response.get("results", []):
            results.append(f"**{item['title']}**\n{item['content']}\nSource: {item['url']}")

        print(f"[Search] Found {len(results)} results")
        return "\n\n---\n\n".join(results) if results else "No results found."
    except Exception as e:
        error_msg = f"[Search error: {type(e).__name__}: {str(e)}]"
        print(error_msg)
        return error_msg
