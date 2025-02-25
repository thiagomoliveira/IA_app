export default class FileReaderHandler {
  static async readFile(file) {
    if (!file) {
      throw new Error("Nenhum arquivo enviado.");
    }

    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!FileReaderHandler.isSupportedExtension(fileExtension)) {
      throw new Error("Formato não suportado");
    }

    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      FileReaderHandler.setupReaderEvents(
        reader,
        fileExtension,
        resolve,
        reject
      );
      FileReaderHandler.readFileContent(reader, file, fileExtension);
    });
  }

  static isSupportedExtension(extension) {
    return ["txt", "docx"].includes(extension);
  }

  static setupReaderEvents(reader, fileExtension, resolve, reject) {
    reader.onload = async () => {
      try {
        if (fileExtension === "txt") {
          resolve(reader.result);
        } else if (fileExtension === "docx") {
          const result = await mammoth.extractRawText({
            arrayBuffer: reader.result,
          });
          resolve(result.value);
        }
      } catch (error) {
        reject(new Error(error.message));
      }
    };

    // Tratamento de erro do FileReader
    reader.onerror = () => {
      reject(new Error("Erro ao ler o arquivo"));
    };
  }

  static readFileContent(reader, file, fileExtension) {
    if (fileExtension === "txt") {
      reader.readAsText(file);
    } else if (fileExtension === "docx") {
      reader.readAsArrayBuffer(file);
    }
  }
}
