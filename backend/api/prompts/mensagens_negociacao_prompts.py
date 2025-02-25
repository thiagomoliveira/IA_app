def prompt_novo_briefing() -> str:
    return """
    A partir dos dados fornecidos (Briefing Original, Segmento), crie um novo briefing mais envolvente e detalhado, para nos ajudar em campanhas.
    Após isso, formate o texto com tags HTML apropriadas para ser exibida em uma página web, como <h2> para títulos e <p> para parágrafos, etc.
    O objetivo é que o novo briefing seja facilmente integrado em uma página HTML para melhor visualização.

    Briefing Original: {briefing}
    Segmento: {segmento}

    Retorne apenas o novo briefing em HTML, sem explicações adicionais, sem introduções e sem qualquer outro texto, nem mesmo ``` ou html.
    """

def prompt_mensagens_marketing() -> str:
    return """
    A partir do briefing abaixo e das mensagens de exemplo, crie 3 mensagens de marketing envolventes e criativas.
    Retorne apenas uma lista JSON(sem introduções e sem qualquer outro texto) com as mensagens, no formato:

    ["Mensagem 1", "Mensagem 2", "Mensagem 3"]

    Não inclua "[" ou "]" nas frases, para não dificultar a criação da lista

    Briefing: {novo_briefing}
    Exemplos: {exemplo}
    """