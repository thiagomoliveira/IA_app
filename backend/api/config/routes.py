from fastapi import APIRouter
from endpoints.negociacao import router as negociacao

router = APIRouter()

# Inclui os endpoints de negociação de mensagens
router.include_router(negociacao, prefix="/negociacao", tags=["Negociação"])
