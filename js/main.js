import { searchSemiconductor } from '../modules/semiconductorDatasheet.js';

const resultDiv = document.getElementById("result");
const inputValue = document.getElementById("input-value");
const btnDecode = document.getElementById("btn-decode");
const currentMode = document.getElementById("current-mode");

// 1. Lógica del Teclado (Escribir en el input)
document.querySelectorAll('.key-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const char = btn.innerText;
        if (char === 'C') {
            inputValue.value = '';
            resultDiv.innerHTML = '<p style="color: #666;">Listo...</p>';
        }
        else if (char === '⌫') inputValue.value = inputValue.value.slice(0, -1);
        else inputValue.value += char;
    });
});

// 2. Lógica del botón DECODIFICAR
btnDecode.addEventListener("click", async () => {
    const val = inputValue.value.toUpperCase().trim();
    const mode = currentMode.innerText;

    if (!val) return;

    if (mode.includes("DATASHEET")) {
        resultDiv.innerHTML = "<p style='color: #00ffc3;'>Consultando Servidor...</p>";
        const result = await searchSemiconductor(val);
        resultDiv.innerHTML = result.html;
    } else {
        // Aquí mantienes tu lógica para otros modos
        resultDiv.innerHTML = `<p style="color: #00ffc3;">Modo ${mode} activo: ${val}</p>`;
    }
});

// 3. Función para cambiar de modo sin recargar (Cargada al objeto window)
window.setMode = (modeName) => {
    currentMode.innerText = `MODO: ${modeName.toUpperCase()}`;
    resultDiv.innerHTML = "Listo para decodificar";
    inputValue.value = "";
    
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase() === modeName.toLowerCase()) {
            btn.classList.add('active');
        }
    });
};