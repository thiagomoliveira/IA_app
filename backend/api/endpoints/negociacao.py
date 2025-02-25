import logging
from typing import Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from exceptions.langchain_exception import LangchainException 
from tasks.marketing_task import gerar_novo_briefing, gerar_mensagens_marketing

router = APIRouter()
logger = logging.getLogger(__name__)

class ConfiguracoesLLM(BaseModel):
    temperatura: float

class NegotiationMessageSchema(BaseModel):
    briefing: str
    segmento: str
    exemplo: str
    configuracoes_llm_mensagens: ConfiguracoesLLM
    configuracoes_llm_briefing: ConfiguracoesLLM

@router.post("/criar-mensagem-negociacao/", response_model=Dict[str, Any])
async def criar_mensagem_negociacao_endpoint(data: NegotiationMessageSchema):
    """
    Gera novo briefing e 3 novas mensagens de negociação baseada nos dados fornecidos.

    Args:
        data (NegotiationMessageSchema): Dados de entrada contendo briefing, segmento, exemplo e configurações da LLM.

    Returns:
        dict: Novo briefing gerado e mensagens de marketing associadas.
    """
    try:
        logger.info("Recebendo solicitação para criar mensagem de negociação")
        
        temperatura_briefing = data.configuracoes_llm_briefing.temperatura
        temperatura_mensagens = data.configuracoes_llm_mensagens.temperatura

        novo_briefing = gerar_novo_briefing(data.briefing, data.segmento, temperatura_briefing)
        mensagens_marketing = gerar_mensagens_marketing(novo_briefing, data.exemplo, temperatura_mensagens)

        logger.info("Mensagem de negociação gerada com sucesso")

        return {
            "novo_briefing": novo_briefing,
            "mensagens_marketing": mensagens_marketing
        }
    
    except LangchainException as e:
        logger.error(f"Erro específico do Langchain: {e.message}")
        raise HTTPException(status_code=400, detail=e.message)
    
    except Exception as e:
        logger.exception("Erro inesperado no servidor")
        raise HTTPException(status_code=500, detail="Erro interno no servidor. Verifique os logs para mais detalhes.")
