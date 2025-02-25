export function sincronizarValorRangeSlider(inputId, spanId) {
  const input = document.getElementById(inputId);
  const span = document.getElementById(spanId);

  if (input && span) {
    input.addEventListener("input", function () {
      span.textContent = input.value;
    });
  }
}
