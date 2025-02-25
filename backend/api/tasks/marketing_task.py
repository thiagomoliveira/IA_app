from services.llm_service import gerar_chat_prompt, invocar_modelo
from prompts.mensagens_negociacao_prompts import prompt_novo_briefing, prompt_mensagens_marketing
from utils.json_utils import extrair_lista_de_json
from langchain_openai import ChatOpenAI
from typing import List


SYSTEM_PROMPT="Você é um assistente virtual prestativo e especializado em marketing e criação de novos textos."

def gerar_novo_briefing(briefing: str, segmento: str, temperature:float=0.1) -> str:    
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=temperature)
    user_prompt = prompt_novo_briefing()
    input_data: dict = {"briefing": briefing, "segmento": segmento}

    prompt = gerar_chat_prompt(SYSTEM_PROMPT, user_prompt)    
    return invocar_modelo(llm, prompt, input_data)

# Gerar mensagens de marketing
def gerar_mensagens_marketing(novo_briefing: str, exemplo: str, temperature:float=0.1) -> List[str]:
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=temperature)
    
    user_prompt = prompt_mensagens_marketing()
    input_data: dict = {"novo_briefing": novo_briefing, "exemplo": exemplo}

    prompt = gerar_chat_prompt(SYSTEM_PROMPT, user_prompt)
    mensagens: str = invocar_modelo(llm, prompt, input_data)

    return extrair_lista_de_json(mensagens)