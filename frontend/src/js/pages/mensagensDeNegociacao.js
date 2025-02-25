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
  sincronizarValorRangeSlider(
    "temperatura_briefing",
    "temperatura_briefing_valor"
  );
});
// Extensões de arquivo permitidas
const allowedFileExtensions = ["txt", "docx"];

const dragAndDropExemplo = new DragAndDropSingleFile(
  "#drop_zone_exemplo",
  allowedFileExtensions
);
const dragAndDropSegmento = new DragAndDropSingleFile(
  "#drop_zone_segmento",
  allowedFileExtensions
);
const dragAndDropBriefing = new DragAndDropSingleFile(
  "#drop_zone_briefing",
  allowedFileExtensions
);

const botaoGerarMensagens = document.querySelector("#botao_gerar_mensagens");

botaoGerarMensagens.addEventListener("click", async () => {
  exibirProcessamento(true); // Exibe o carregamento

  const exemploFile = dragAndDropExemplo.getFile();
  const segmentoFile = dragAndDropSegmento.getFile();
  const briefingFile = dragAndDropBriefing.getFile();

  const jsonContent = {
    exemplo: "",
    segmento: "",
    briefing: "",
    configuracoes_llm_mensagens: {
      temperatura:
        parseFloat(document.getElementById("temperatura_mensagens").value) / 10,
    },
    configuracoes_llm_briefing: {
      temperatura:
        parseFloat(document.getElementById("temperatura_briefing").value) / 10,
    },
  };

  try {
    // Adiciona os conteúdos dos arquivos ao json
    await addFileContentToJson(exemploFile, "exemplo", jsonContent);
    await addFileContentToJson(segmentoFile, "segmento", jsonContent);
    await addFileContentToJson(briefingFile, "briefing", jsonContent);

    // Valida os campos
    const mensagemErro = validarCampos(jsonContent);

    if (mensagemErro) {
      alert(mensagemErro);
    } else {
      const response = await criarMensagemNegociacao(jsonContent);
      exibirResposta(response.data); // Exibe a resposta da API
    }
  } catch (error) {
    alert("Erro durante o processamento, veja o console para detalhes");
    console.error("Erro durante o processamento:", error);
  } finally {
    exibirProcessamento(false);
  }
});

function exibirResposta(response) {
  console.log(response);
  const mensagensContainer = document.querySelector("#mensagens-container");
  mensagensContainer.innerHTML = "";

  const briefingText = document.querySelector("#briefing-text");

  // Exibe as mensagens geradas
  if (response && response.mensagens_marketing) {
    response.mensagens_marketing.forEach((mensagem) => {
      const p = document.createElement("p");
      p.textContent = mensagem;
      mensagensContainer.appendChild(p);
    });
  } else {
    mensagensContainer.innerHTML = "<p>Nenhuma mensagem gerada.</p>";
  }

  // Exibe o briefing detalhado
  if (response && response.novo_briefing) {
    briefingText.innerHTML = response.novo_briefing;
  } else {
    briefingText.textContent = "Nenhum briefing disponível.";
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
