from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # DeepSeek / OpenAI-compatible
    DEEPSEEK_API_KEY: str = ""
    DEEPSEEK_BASE_URL: str = "https://api.deepseek.com"
    DEEPSEEK_MODEL: str = "deepseek-chat"

    # Tavily
    TAVILY_API_KEY: str = ""

    # ChromaDB
    CHROMA_PERSIST_DIR: str = "./data/chroma"

    # App
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    CORS_ORIGINS: str = "*"

    @property
    def cors_origins_list(self) -> List[str]:
        raw = (self.CORS_ORIGINS or "").strip()
        if raw in ("", "*"):
            return ["*"]
        # Support both JSON array ("[\"http://a.com\"]") and comma-separated ("http://a.com,http://b.com")
        if raw.startswith("["):
            try:
                import json

                parsed = json.loads(raw)
                if isinstance(parsed, list):
                    return [str(o).strip() for o in parsed if str(o).strip()]
            except (ValueError, TypeError):
                pass
        return [o.strip() for o in raw.split(",") if o.strip()]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
