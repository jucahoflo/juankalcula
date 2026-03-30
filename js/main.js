import { searchSemiconductor } from '../modules/semiconductorDatasheet.js';

const resultDiv = document.getElementById("result");
const inputValue = document.getElementById("input-value");
const btnDecode = document.getElementById("btn-decode");
const currentMode = document.getElementById("current-mode");

// Lógica para que los botones del teclado escriban en el input
document.querySelectorAll('.key-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const char = btn.innerText;
        if (char === 'C') inputValue.value = '';
        else if (char === '⌫') inputValue.value = inputValue.value.slice(0, -1);
        else inputValue.value += char;
    });
});

// Lógica del botón DECODIFICAR
btnDecode.addEventListener("click", async () => {
    const val = inputValue.value.toUpperCase().trim();
    const mode = currentMode.innerText;

    if (!val) return;

    if (mode.includes("DATASHEET")) {
        resultDiv.innerHTML = "<p style='color: #00ffc3;'>Buscando en la nube...</p>";
        const result = await searchSemiconductor(val);
        resultDiv.innerHTML = result.html;
    } else {
        // AQUÍ mantén tu código de resistencias/capacitores
        resultDiv.innerHTML = `<p>Decodificando ${mode}: ${val}</p>`;
    }
});

// Función para cambiar modos (global para los botones onclick del HTML)
window.setMode = (mode) => {
    currentMode.innerText = `MODO: ${mode.toUpperCase()}`;
    resultDiv.innerHTML = "Listo para decodificar";
    inputValue.value = "";
    // Actualizar botones activos
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
};