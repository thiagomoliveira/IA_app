import logging
from typing import List
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from exceptions.langchain_exception import LangchainException 
from tasks.marketing_task import gerar_mensagens_marketing_e_sugestoes_de_melhoria

router = APIRouter()
logger = logging.getLogger(__name__)

class ConfiguracoesLLM(BaseModel):
    temperature: float

class NegotiationMessageSchema(BaseModel):
    briefing: str
    ordenar_mensagens: bool
    quantidade_mensagens: int
    configuracoes_llm: ConfiguracoesLLM

class NegotiationResponseSchema(BaseModel):
    mensagens_marketing: List[str]
    sugestoes_melhoria: str
    
@router.post("/criar-mensagem-negociacao/", response_model=NegotiationResponseSchema)
async def criar_mensagem_negociacao_endpoint(data: NegotiationMessageSchema):
    """
    Gera mensagens de negociação e sugestões de melhoria para o briefing fornecido.

    Args:
        data (NegotiationMessageSchema): Dados de entrada contendo briefing, configurações da LLM 
        e opções de ordenação.

    Returns:
        NegotiationResponseSchema: Contém as mensagens geradas e sugestões de melhoria para o briefing.
    """
    try:
        logger.info("Recebendo solicitação para criar mensagem de negociação")

        response = gerar_mensagens_marketing_e_sugestoes_de_melhoria(data)

        logger.info("Mensagem de negociação gerada com sucesso")

        return NegotiationResponseSchema(
            mensagens_marketing=response['mensagens_marketing'],
            sugestoes_melhoria=response['sugestoes_melhoria']
        )
    
    except LangchainException as e:
        logger.error(f"Erro específico do Langchain: {e.message}")
        raise HTTPException(status_code=400, detail=e.message)
    
    except Exception as e:
        logger.exception("Erro inesperado no servidor")
        raise HTTPException(status_code=500, detail="Erro interno no servidor. Verifique os logs para mais detalhes.")
