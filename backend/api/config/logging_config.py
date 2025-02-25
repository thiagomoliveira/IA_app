import logging

LOG_LEVEL = logging.INFO
LOG_FORMAT = "%(asctime)s - %(levelname)s - %(name)s - %(message)s"

def setup_logging():
    logging.basicConfig(level=LOG_LEVEL, format=LOG_FORMAT)
    uvicorn_logger = logging.getLogger("uvicorn")
    uvicorn_logger.setLevel(LOG_LEVEL)
    return logging.getLogger("advanced_analytics")
