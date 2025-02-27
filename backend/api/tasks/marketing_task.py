from services.llm_service import gerar_chat_prompt, invocar_modelo
from prompts.mensagens_negociacao_prompts import prompt_mensagens_marketing, prompt_sugestoes
from utils.json_utils import extrair_lista_de_json
from langchain_openai import ChatOpenAI
from typing import List, Dict, Any

SYSTEM_PROMPT = "Você é um assistente virtual prestativo e especializado em marketing e criação de novos textos."

def gerar_mensagens_marketing(data) -> List[str]:
    """
    Gera uma lista de mensagens de marketing com base no briefing fornecido.
    
    Args:
        data: Dados de entrada, incluindo o briefing, quantidade de mensagens e opção de ordenar.
    
    Returns:
        List[str]: Lista de mensagens de marketing geradas.
    """
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=data.configuracoes_llm.temperature)
    
    user_prompt = prompt_mensagens_marketing()
    input_data: Dict[str, Any] = {
        "briefing": data.briefing,
        "quantidade_mensagens": data.quantidade_mensagens,
        "ordenar_mensagens": data.ordenar_mensagens
    }
    prompt = gerar_chat_prompt(SYSTEM_PROMPT, user_prompt)

    mensagens: str = invocar_modelo(llm, prompt, input_data)    
    return extrair_lista_de_json(mensagens)

def gerar_sugestoes_de_melhoria(data) -> str:
    """
    Gera sugestões de melhoria para o briefing fornecido.
    
    Args:
        data: Dados de entrada, incluindo o briefing.
    
    Returns:
        str: Sugestões de melhoria geradas.
    """
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=data.configuracoes_llm.temperature)
    
    user_prompt = prompt_sugestoes()
    input_data: Dict[str, Any] = {"briefing": data.briefing}
    prompt = gerar_chat_prompt(SYSTEM_PROMPT, user_prompt)

    sugestoes: str = invocar_modelo(llm, prompt, input_data)
    return sugestoes

def gerar_mensagens_marketing_e_sugestoes_de_melhoria(data) -> Dict[str, List[str]]:
    """
    Gera tanto as mensagens de marketing quanto as sugestões de melhoria com base no briefing fornecido.
    
    Args:
        data: Dados de entrada, incluindo o briefing, quantidade de mensagens e opções de ordenação.
    
    Returns:
        Dict[str, Any]: Dicionário contendo as mensagens de marketing e as sugestões de melhoria.
    """
    mensagens_marketing = gerar_mensagens_marketing(data)
    sugestoes_melhoria = gerar_sugestoes_de_melhoria(data)

    return {
        "mensagens_marketing": mensagens_marketing,
        "sugestoes_melhoria": sugestoes_melhoria
    }
