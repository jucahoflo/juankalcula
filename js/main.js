import { searchSemiconductor } from '../modules/semiconductorDatasheet.js';

const resultDiv = document.getElementById("result");
const inputValue = document.getElementById("input-value");
const btnDecode = document.getElementById("btn-decode");
const currentMode = document.getElementById("current-mode");

// Escribir con el teclado de la pantalla
document.querySelectorAll('.key-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const char = btn.innerText;
        if (char === 'C') inputValue.value = '';
        else if (char === '⌫') inputValue.value = inputValue.value.slice(0, -1);
        else inputValue.value += char;
    });
});

// Botón Decodificar
btnDecode.addEventListener("click", async () => {
    const val = inputValue.value.toUpperCase().trim();
    const mode = currentMode.innerText;

    if (!val) return;

    if (mode.includes("DATASHEET")) {
        resultDiv.innerHTML = "<p style='color: #00ffc3;'>Buscando...</p>";
        const result = await searchSemiconductor(val);
        resultDiv.innerHTML = result.html;
    }
});

// Cambiar modos
window.setMode = (mode) => {
    currentMode.innerText = `MODO: ${mode.toUpperCase()}`;
    resultDiv.innerHTML = "Listo para decodificar";
    inputValue.value = "";
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
};