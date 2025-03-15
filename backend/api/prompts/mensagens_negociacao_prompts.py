def prompt_mensagens() -> str:
    return """
    Task: Generate engaging and creative messages.

    **Important**:  
    - You must generate **exactly** {quantidade_mensagens} messages. No more, no less.  
    - If `sort_messages` is `true`, the messages should follow a logical sequence, forming a cohesive narrative or campaign strategy.  
      Examples: guiding the audience through a **sales funnel**, telling an **engaging brand story**, or building anticipation with **progressive messaging**.  
    - If `sort_messages` is `false`, the messages should be independent, meaning each message must stand alone without relying on previous or future messages for context.  
      - Each message should be **self-contained**, conveying a complete idea on its own.  
      - This ensures the messages can be used **interchangeably** across different marketing contexts.  

    **Response format**:  
    - Return **only** a JSON list with the messages (no introductions or additional text).  
    - Expected format:  
      `["Message 1", "Message 2", "Message 3"]`  
    - Do not number the messages.  
    - Return the messages as plain strings, without escape characters or unnecessary formatting.  
    - Make sure the messages do not contain brackets (`[` or `]`) within the text to avoid parsing issues.  

    **Briefing Alignment**:  
    - The messages **must** be fully aligned with the briefing below to ensure they are relevant and effective for the campaign.  

    **Parameter**: 
    `sort_messages = {ordenar_mensagens}`  
     `quantity_messages = {quantidade_mensagens}  `   

    **Briefing**:  
    {briefing}

    Finally, translate the messages into Portuguese.
    """
