from fastapi import FastAPI
from config.routes import router
from config.logging_config import setup_logging
from config.middleware import setup_middleware

# Configurar logging
logger = setup_logging()

app = FastAPI(title="Advanced Analytics API")

setup_middleware(app)

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True, log_level="info")
