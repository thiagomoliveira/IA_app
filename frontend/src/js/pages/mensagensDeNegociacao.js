import DragAndDropSingleFile from "../modules/DragAndDropSingleFile.js";
import FileReaderHandler from "../modules/FileReaderHandler.js";
import BaseAPIService from "../services/BaseAPIService.js";
import {
  exibirProcessamento,
  adicionarCarregamento,
} from "../utils/messageUtils.js";
import { sincronizarValorRangeSlider } from "../utils/sliderUtils.js";

adicionarCarregamento();
document.addEventListener("DOMContentLoaded", function () {
  sincronizarValorRangeSlider(
    "temperatura_mensagens",
    "temperatura_mensagens_valor"
  );
});
// Extensões de arquivo permitidas
const allowedFileExtensions = ["txt", "docx"];

const dragAndDropBriefing = new DragAndDropSingleFile(
  "#drop_zone_briefing",
  allowedFileExtensions
);

const botaoGerarMensagens = document.querySelector("#botao_gerar_mensagens");

botaoGerarMensagens.addEventListener("click", async () => {
  exibirProcessamento(true); // Exibe o carregamento

  const briefingFile = dragAndDropBriefing.getFile();
  const mensagensSequenciais = document.getElementById(
    "mensagens_sequenciais"
  ).checked;

  const numeroMensagens = document.getElementById("numero_mensagens").value;

  const jsonContent = {
    briefing: "",
    ordenar_mensagens: mensagensSequenciais,
    quantidade_mensagens: numeroMensagens,
    configuracoes_llm: {
      temperature:
        parseFloat(document.getElementById("temperatura_mensagens").value) / 10,
    },
  };

  try {
    // Adiciona os conteúdos dos arquivos ao json
    await addFileContentToJson(briefingFile, "briefing", jsonContent);

    // Valida os campos
    const mensagemErro = validarCampos(jsonContent);
    if (mensagemErro) {
      alert(mensagemErro);
    } else {
      const response = await criarMensagemNegociacao(jsonContent);
      exibirResposta(response.data, mensagensSequenciais); // Exibe a resposta da API
    }
  } catch (error) {
    alert("Erro durante o processamento, veja o console para detalhes");
    console.error("Erro durante o processamento:", error);
  } finally {
    exibirProcessamento(false);
  }
});

function exibirResposta(response, mensagensSequenciais) {
  const mensagensContainer = document.querySelector("#mensagens-container");
  mensagensContainer.innerHTML = "";

  // Exibe as mensagens geradas
  if (response && response.mensagens_marketing) {
    if (mensagensSequenciais) {
      // Se for sequência ordenada
      response.mensagens_marketing.forEach((mensagem, index) => {
        const p = document.createElement("p");
        p.innerHTML = `<strong>${index + 1}.</strong> ${mensagem}`;

        // Adiciona margem de 10px em todas, exceto a última
        if (index < response.mensagens_marketing.length - 1) {
          p.style.marginBottom = "10px";
        }

        mensagensContainer.appendChild(p);
      });
    } else {
      // Se não for sequência ordenada, usa lista com bolinhas
      const ul = document.createElement("ul");
      response.mensagens_marketing.forEach((mensagem, index) => {
        const li = document.createElement("li");
        li.textContent = mensagem;

        // Adiciona margem de 10px em todos, exceto o último
        if (index < response.mensagens_marketing.length - 1) {
          li.style.marginBottom = "10px";
        }

        ul.appendChild(li);
      });
      mensagensContainer.appendChild(ul);
    }
  } else {
    mensagensContainer.innerHTML = "<p>Nenhuma mensagem gerada.</p>";
  }
}

async function criarMensagemNegociacao(jsonContent) {
  const baseService = new BaseAPIService(
    "negociacao/criar-mensagem-negociacao"
  );
  const response = await baseService.create(jsonContent);

  if (response.success === true) {
    return response;
  } else {
    const errorMessages = response.errors.join("\n");
    alert("Erro ao criar mensagem de negociação:\n" + errorMessages);
  }
}

async function addFileContentToJson(file, key, jsonContent) {
  if (file != null) {
    try {
      const content = await FileReaderHandler.readFile(file);
      if (content !== null) {
        jsonContent[key] = content;
      }
    } catch (error) {
      alert(`Erro ao ler o arquivo ${file.name}: ${error.message}`);
    }
  }
}

function validarCampos(jsonContent) {
  // Se todos os campos estiverem vazios (todos os valores de jsonContent são "" ou null)
  if (Object.values(jsonContent).every((value) => value === "")) {
    return `Por favor, envie os arquivos antes de apertar o botão.`;
  }

  // Filtra as chaves que têm valor "" (vazio)
  const camposVazios = Object.keys(jsonContent).filter(
    (key) => jsonContent[key] === ""
  );

  // Se houver campos vazios, retorna os campos
  if (camposVazios.length > 0) {
    return `Por favor, envie o(s) arquivo(s): ${camposVazios.join(", ")}`;
  }

  return null;
}

const mensagensSequenciaisCheckbox = document.getElementById(
  "mensagens_sequenciais"
);
const numeroMensagensInput = document.getElementById("numero_mensagens");

mensagensSequenciaisCheckbox.addEventListener("change", () => {
  let numeroMensagens = parseInt(numeroMensagensInput.value);

  if (mensagensSequenciaisCheckbox.checked && numeroMensagens < 4) {
    numeroMensagensInput.value = 4; // Ajusta para 4
  }
});
