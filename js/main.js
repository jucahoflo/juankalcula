import { searchSemiconductor } from '../modules/semiconductorDatasheet.js';

let mode = "calc";

const fullKeys = [
    { label: "C", action: "clearDisplay()" },
    { label: "⌫", action: "del()" },
    { label: "%", action: "percent()" },
    { label: "√", action: "sqrt()" },
    { label: "7", action: "add('7')" }, { label: "8", action: "add('8')" }, { label: "9", action: "add('9')" }, { label: "÷", action: "add('/')" },
    { label: "4", action: "add('4')" }, { label: "5", action: "add('5')" }, { label: "6", action: "add('6')" }, { label: "×", action: "add('*')" },
    { label: "1", action: "add('1')" }, { label: "2", action: "add('2')" }, { label: "3", action: "add('3')" }, { label: "−", action: "add('-')" },
    { label: "0", action: "add('0')" }, { label: ".", action: "add('.')" }, { label: "=", action: "calculate()" }, { label: "+", action: "add('+')" },
    { label: "A", action: "add('A')" }, { label: "B", action: "add('B')" }, { label: "C", action: "add('C')" }, { label: "D", action: "add('D')" },
    { label: "E", action: "add('E')" }, { label: "F", action: "add('F')" }, { label: "G", action: "add('G')" }, { label: "H", action: "add('H')" },
    { label: "I", action: "add('I')" }, { label: "J", action: "add('J')" }, { label: "K", action: "add('K')" }, { label: "L", action: "add('L')" },
    { label: "M", action: "add('M')" }, { label: "N", action: "add('N')" }, { label: "O", action: "add('O')" }, { label: "P", action: "add('P')" },
    { label: "Q", action: "add('Q')" }, { label: "R", action: "add('R')" }, { label: "S", action: "add('S')" }, { label: "T", action: "add('T')" },
    { label: "U", action: "add('U')" }, { label: "V", action: "add('V')" }, { label: "W", action: "add('W')" }, { label: "X", action: "add('X')" },
    { label: "Y", action: "add('Y')" }, { label: "Z", action: "add('Z')" }
];

// Función para dibujar el teclado
function renderKeys() {
    const container = document.getElementById("keys");
    if (!container) return;
    container.innerHTML = fullKeys
        .map(k => `<button class="key-btn" onclick="${k.action}">${k.label}</button>`)
        .join("");
}

// Función para cambiar de modo
window.setMode = function(m) {
    mode = m;
    const titles = {
        calc: "CALCULADORA", resistor: "RESISTENCIA",
        capacitor: "CAPACITOR", identify: "IDENTIFICAR",
        e96: "E96", semiconductor: "DATASHEET"
    };

    const modeIndicator = document.getElementById("modeIndicator");
    if (modeIndicator) modeIndicator.innerText = "MODO: " + titles[m];

    document.getElementById("operation").innerText = "0";
    document.getElementById("result").innerText = "0";
    
    // RE-RENDERIZAR EL TECLADO PARA QUE NO DESAPAREZCA
    renderKeys();
}

// Función principal DECODIFICAR
window.run = async function() {
    let value = document.getElementById("operation").innerText.trim();
    if (value === "0" && mode !== "calc") return;

    try {
        if (mode === "semiconductor") {
            document.getElementById("result").innerHTML = "<p style='color: #00ffc3;'>Buscando...</p>";
            const res = await searchSemiconductor(value);
            document.getElementById("result").innerHTML = res.html;
        } else {
            // Lógica de cálculo normal
            calculate();
        }
    } catch (e) {
        document.getElementById("result").innerText = "Error: " + e.message;
    }
}

// Asegurar que las funciones de cálculo sean globales si están en este archivo
window.renderKeys = renderKeys;

// Arrancar el teclado al cargar
document.addEventListener("DOMContentLoaded", renderKeys);