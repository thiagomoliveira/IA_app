def prompt_sugestoes() -> str:
    return """
    A partir do briefing fornecido, forneça sugestões práticas de melhoria para otimizar nossas campanhas.

    Em seguida, formate as sugestões usando tags HTML apropriadas para exibição em uma página web. Use, por exemplo, <h2> para títulos e <p> para parágrafos, e outras tags conforme necessário, para garantir que o conteúdo seja facilmente visualizável.

    O objetivo é que o novo briefing seja facilmente integrado em uma página HTML sem precisar de ajustes adicionais.

    Briefing: {briefing}

    Retorne apenas o conteúdo formatado em HTML, sem explicações adicionais ou texto extra. Não inclua blocos de código ou tags como ``` ou <html>.
"""

def prompt_mensagens_marketing() -> str:
    return """
    A partir do briefing abaixo, crie {quantidade_mensagens} mensagens de marketing envolventes e criativas.

    Caso o parâmetro 'ordenar_mensagens' seja true, as mensagens devem seguir uma sequência lógica dentro da campanha, ou seja, devem se complementar e formar uma narrativa ou estratégia coesa.

    Caso contrário, as mensagens devem ser criadas de forma independente, sem a necessidade de seguirem uma sequência lógica.

    Retorne apenas uma lista JSON (sem introduções e sem qualquer outro texto) com as mensagens, no formato do exemplo:

    ["Mensagem 1", "Mensagem 2", "Mensagem 3"]

    **Importante**: Não inclua a numeração nas mensagens (como "Mensagem 1", "Mensagem 2", etc.). Apenas forneça o conteúdo das mensagens diretamente, sem prefixos.

    Não inclua os caracteres de escape ou aspas extras nas mensagens. Apenas retorne as mensagens como strings normais, sem as barras invertidas ("\\") ou outras escapadas. As mensagens devem ser retornadas de forma simples e legível.

    Não inclua os caracteres "[" ou "]" nas frases, para não dificultar a conversão da lista.

    Parametro: ordenar_mensagens = {ordenar_mensagens}

    Briefing: {briefing}
    """
