import json
import logging

def extrair_lista_de_json(texto: str) -> list[str]:
    """
    Tenta converter uma string JSON para uma lista de strings.
    Se a conversão falhar, retorna uma lista com as três primeiras linhas do texto original.
    """
    try:
        mensagens_json = json.loads(texto)
        if isinstance(mensagens_json, list) and all(isinstance(msg, str) for msg in mensagens_json):
            return mensagens_json
    except json.JSONDecodeError:
        logging.error(f"Erro ao converter JSON, resposta: {texto}")

    return [msg.strip() for msg in texto.split("\n")[:3] if msg.strip()]
