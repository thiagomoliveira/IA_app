import logging
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from exceptions.langchain_exception import LangchainException


def gerar_chat_prompt(system_prompt: str, user_prompt: str) -> ChatPromptTemplate:
    return ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("user", user_prompt)
    ])

# Invocar o modelo
def invocar_modelo(llm, prompt, input_data: dict) -> str:
    chain = prompt | llm | StrOutputParser()
    try:
        return chain.invoke(input_data)
    except Exception as e:
        logging.error(f"Erro ao invocar o modelo: {e}")
        raise LangchainException(f"Erro ao invocar o modelo: {str(e)}")
