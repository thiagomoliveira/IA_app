from services.llm_service import gerar_chat_prompt, invocar_modelo
from prompts.mensagens_negociacao_prompts import prompt_mensagens
from utils.json_utils import extrair_lista_de_json
from langchain_openai import ChatOpenAI
from typing import List, Dict, Any

def gerar_mensagens(data) -> List[str]:
    """
    Gera uma lista de mensagens de marketing com base no briefing fornecido.
    
    Args:
        data: Dados de entrada, incluindo o briefing, quantidade de mensagens e opção de ordenar.
    
    Returns:
        List[str]: Lista de mensagens de marketing geradas.
    """
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=data.configuracoes_llm.temperature)
    
    user_prompt = prompt_mensagens()
    input_data: Dict[str, Any] = {
        "briefing": data.briefing,
        "quantidade_mensagens": data.quantidade_mensagens,
        "ordenar_mensagens": data.ordenar_mensagens
    }
    SYSTEM_PROMPT = "You are a helpful virtual assistant specialized in creating engaging and creative messages."
    prompt = gerar_chat_prompt(SYSTEM_PROMPT, user_prompt)

    mensagens: str = invocar_modelo(llm, prompt, input_data)    
    return extrair_lista_de_json(mensagens)