export default class BaseAPIService {
  constructor(resource) {
    this.apiClient = axios.create({
      baseURL: `http://127.0.0.1:8000/${resource}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Função para criar um novo recurso
  async create(data) {
    try {
      const response = await this.apiClient.post(`/`, data);
      return { success: true, data: response.data };
    } catch (error) {
      // Se ocorrer um erro, processamos
      const errorMessages = this.handleError(error);
      return { success: false, errors: errorMessages };
    }
  }

  // Função para processar os erros da API
  handleError(error) {
    let errorMessages = [];

    if (!error.response) {
      errorMessages.push("O servidor pode estar desligado ou inacessível.");
    } else {
      const status = error.response.status;
      const errorData = error.response.data;

      errorMessages.push(...this.classifyErrorStatus(status));
      if (errorData) {
        errorMessages.push(...this.processErrorData(errorData));
      }
    }

    return errorMessages;
  }

  classifyErrorStatus(status) {
    let statusMessage = [];

    if (status >= 400 && status < 500) {
      statusMessage.push(`Status ${status}.`);
    } else if (status >= 500) {
      statusMessage.push(`Status ${status}.`);
    }

    return statusMessage;
  }

  // Processa os dados de erro específicos retornados do backend
  processErrorData(errorData) {
    let messages = [];

    // Verifica se errorData tem a chave 'detail' e é um array
    if (errorData.detail && Array.isArray(errorData.detail)) {
      errorData.detail.forEach((item) => {
        if (item.msg && item.loc) {
          messages.push(`${item.msg}: ${item.loc[1]}`);
        } else if (item.msg) {
          messages.push(`${item.msg}`);
        }
      });
    }
    // Verifica se errorData tem a chave 'errors' e é um array
    else if (errorData.errors && Array.isArray(errorData.errors)) {
      errorData.errors.forEach((errorMsg) => {
        messages.push(errorMsg);
      });
    }
    // Caso os dados de erro não sigam o formato esperado
    else {
      messages.push("Detalhes de erro não disponíveis.");
    }

    return messages;
  }
}
