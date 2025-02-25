export function adicionarCarregamento() {
  const loadingElement = document.createElement("div");
  loadingElement.id = "loading";

  // Spinner de carregamento
  const spinner = document.createElement("div");
  spinner.className = "loader";
  loadingElement.appendChild(spinner);

  const overlayElement = document.createElement("div");
  overlayElement.id = "overlay";

  // Adiciona o overlay e o spinner ao body
  document.body.appendChild(overlayElement);
  document.body.appendChild(loadingElement);
}

export function exibirProcessamento(estado) {
  const loadingElement = document.getElementById("loading");
  const overlayElement = document.getElementById("overlay");

  if (estado) {
    // Exibe o carregamento e o overlay
    loadingElement.style.display = "block";
    overlayElement.style.display = "block";
    document.body.style.overflow = "hidden";
  } else {
    // Esconde o carregamento e o overlay
    loadingElement.style.display = "none";
    overlayElement.style.display = "none";
    document.body.style.overflow = "auto";
  }
}
