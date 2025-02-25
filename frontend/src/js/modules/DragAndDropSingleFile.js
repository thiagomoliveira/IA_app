export default class DragAndDropSingleFile {
  constructor(selector, allowedFileExtensions = []) {
    this.uploadedFile = null;
    this.allowedFileExtensions = allowedFileExtensions;
    this.dropArea = document.querySelector(selector);
    this.removeButton = this.dropArea.querySelector(".remove_file");

    this.bindHandlers();
    this.addEventListeners();
  }

  dropHandler(ev) {
    ev.preventDefault();
    this.dropArea.classList.remove("dragover");

    if (this.uploadedFile) {
      alert(
        "Já existe um arquivo carregado, remova-o antes de carregar outro."
      );
      return;
    }

    let file = this.getFileFromEvent(ev);
    if (!file) {
      alert("Erro ao processar o arquivo. Tente novamente.");
      return;
    }

    if (!this.isValidFileExtension(file)) {
      alert("Extensão de arquivo não permitida.");
      return;
    }

    this.uploadedFile = file;
    this.dropArea.classList.add("has_file");
  }

  dragOverHandler(ev) {
    ev.preventDefault();
    this.dropArea.classList.add("dragover");
  }

  dragLeaveHandler(ev) {
    this.dropArea.classList.remove("dragover");
  }

  removeFileHandler() {
    this.uploadedFile = null;
    this.dropArea.classList.remove("has_file");
  }

  getFile() {
    return this.uploadedFile;
  }

  getFileFromEvent(ev) {
    let file = null;

    if (ev.dataTransfer.items) {
      if (ev.dataTransfer.items.length > 1) {
        alert("Por favor, arraste apenas um arquivo.");
        return null;
      }

      const item = ev.dataTransfer.items[0];
      if (item.kind === "file") {
        file = item.getAsFile();
      }
    } else {
      if (ev.dataTransfer.files.length > 1) {
        alert("Por favor, arraste apenas um arquivo.");
        return null;
      }

      file = ev.dataTransfer.files[0];
    }

    return file;
  }

  isValidFileExtension(file) {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    return (
      this.allowedFileExtensions.length === 0 ||
      this.allowedFileExtensions.includes(fileExtension)
    );
  }

  bindHandlers() {
    this.dropHandler = this.dropHandler.bind(this);
    this.dragOverHandler = this.dragOverHandler.bind(this);
    this.dragLeaveHandler = this.dragLeaveHandler.bind(this);
    this.removeFileHandler = this.removeFileHandler.bind(this);
  }

  addEventListeners() {
    this.dropArea.addEventListener("drop", this.dropHandler);
    this.dropArea.addEventListener("dragover", this.dragOverHandler);
    this.dropArea.addEventListener("dragleave", this.dragLeaveHandler);
    if (this.removeButton) {
      this.removeButton.addEventListener("click", this.removeFileHandler);
    }
  }
}
