import { searchSemiconductor } from '../modules/semiconductorDatasheet.js';

const resultDiv = document.getElementById("result");
const inputValue = document.getElementById("input-value");
const btnDecode = document.getElementById("btn-decode");
const currentMode = document.getElementById("current-mode");

// 1. Lógica del botón DECODIFICAR
btnDecode.addEventListener("click", async () => {
    const value = inputValue.value.toUpperCase().trim();
    const mode = currentMode.innerText;

    if (!value) {
        resultDiv.innerHTML = "<p style='color: #ff5252;'>⚠️ Ingresa un valor</p>";
        return;
    }

    if (mode === "MODO: DATASHEET") {
        resultDiv.innerHTML = "<p style='color: #00ffc3;'>Consultando servidor Cloud...</p>";
        const result = await searchSemiconductor(value);
        resultDiv.innerHTML = result.html;
    } 
    else if (mode === "MODO: RESISTENCIA") {
        // Tu lógica de resistencias aquí
        resultDiv.innerHTML = `<p>Calculando Resistencia para: ${value}</p>`;
    }
    // Añade aquí los demás modos (Capacitor, E96, etc.)
});

// 2. Lógica para cambiar de modo en el menú
document.querySelectorAll(".menu-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        // Quitar clase active de todos y poner al actual
        document.querySelectorAll(".menu-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const modeName = btn.getAttribute("data-mode").toUpperCase();
        currentMode.innerText = `MODO: ${modeName}`;
        resultDiv.innerHTML = `<p style="color: #666;">Listo para ${modeName}</p>`;
        inputValue.value = "";
    });
});