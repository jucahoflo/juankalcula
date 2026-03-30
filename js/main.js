let mode = "calc";

const fullKeys = [
    { label: "C", action: "clearDisplay()" },
    { label: "⌫", action: "del()" },
    { label: "%", action: "percent()" },
    { label: "√", action: "sqrt()" },
    { label: "7", action: "add('7')" },
    { label: "8", action: "add('8')" },
    { label: "9", action: "add('9')" },
    { label: "÷", action: "add('/')" },
    { label: "4", action: "add('4')" },
    { label: "5", action: "add('5')" },
    { label: "6", action: "add('6')" },
    { label: "×", action: "add('*')" },
    { label: "1", action: "add('1')" },
    { label: "2", action: "add('2')" },
    { label: "3", action: "add('3')" },
    { label: "−", action: "add('-')" },
    { label: "0", action: "add('0')" },
    { label: ".", action: "add('.')" },
    { label: "=", action: "calculate()" },
    { label: "+", action: "add('+')" },
    { label: "A", action: "add('A')" }, { label: "B", action: "add('B')" },
    { label: "C", action: "add('C')" }, { label: "D", action: "add('D')" },
    { label: "E", action: "add('E')" }, { label: "F", action: "add('F')" },
    { label: "G", action: "add('G')" }, { label: "H", action: "add('H')" },
    { label: "I", action: "add('I')" }, { label: "J", action: "add('J')" },
    { label: "K", action: "add('K')" }, { label: "L", action: "add('L')" },
    { label: "M", action: "add('M')" }, { label: "N", action: "add('N')" },
    { label: "O", action: "add('O')" }, { label: "P", action: "add('P')" },
    { label: "Q", action: "add('Q')" }, { label: "R", action: "add('R')" },
    { label: "S", action: "add('S')" }, { label: "T", action: "add('T')" },
    { label: "U", action: "add('U')" }, { label: "V", action: "add('V')" },
    { label: "W", action: "add('W')" }, { label: "X", action: "add('X')" },
    { label: "Y", action: "add('Y')" }, { label: "Z", action: "add('Z')" }
];

function renderKeys() {
    const container = document.getElementById("keys");
    if (!container) return;
    container.innerHTML = fullKeys
        .map(k => `<button onclick="${k.action}">${k.label}</button>`)
        .join("");
}

function setMode(m) {
    mode = m;
    const titles = {
        calc: "CALCULADORA", resistor: "RESISTENCIA",
        capacitor: "CAPACITOR", identify: "IDENTIFICAR",
        e96: "E96", semiconductor: "DATASHEET"
    };
    const images = {
        calc: "calculadora.png", resistor: "resistencia.png",
        capacitor: "capacitor.png", identify: "smd.png",
        e96: "e96.png", semiconductor: "transistor.png"
    };

    document.getElementById("modeIndicator").innerText = "MODO: " + titles[m];
    
    // Actualizar imagen lateral
    const img = document.getElementById("componentImg");
    const label = document.getElementById("componentName");
    if(img) img.src = `images/${images[m]}`;
    if(label) label.innerText = titles[m];

    document.getElementById("operation").innerText = "0";
    document.getElementById("result").innerText = "0";
    renderKeys();
}

async function run() {
    let value = document.getElementById("operation").innerText.trim();
    if (value === "0" && mode !== "calc") return;

    try {
        let out = "";
        if (mode === "resistor") out = decodeResistor(value);
        else if (mode === "capacitor") out = decodeCapacitor(value);
        else if (mode === "e96") out = decodeE96(value);
        else if (mode === "identify") out = identify(value);
        else if (mode === "semiconductor") {
            const res = await searchSemiconductor(value);
            document.getElementById("result").innerHTML = res.html;
            return;
        } 
        else if (mode === "calc") { calculate(); return; }

        document.getElementById("result").innerText = out;
    } catch (e) {
        document.getElementById("result").innerText = "Error: " + e.message;
    }
}

document.addEventListener("DOMContentLoaded", renderKeys);