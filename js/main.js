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

    { label: "A", action: "add('A')" },
    { label: "B", action: "add('B')" },
    { label: "C", action: "add('C')" },
    { label: "D", action: "add('D')" },
    { label: "E", action: "add('E')" },
    { label: "F", action: "add('F')" },
    { label: "G", action: "add('G')" },
    { label: "H", action: "add('H')" },
    { label: "I", action: "add('I')" },
    { label: "J", action: "add('J')" },
    { label: "K", action: "add('K')" },
    { label: "L", action: "add('L')" },
    { label: "M", action: "add('M')" },
    { label: "N", action: "add('N')" },
    { label: "O", action: "add('O')" },
    { label: "P", action: "add('P')" },
    { label: "Q", action: "add('Q')" },
    { label: "R", action: "add('R')" },
    { label: "S", action: "add('S')" },
    { label: "T", action: "add('T')" },
    { label: "U", action: "add('U')" },
    { label: "V", action: "add('V')" },
    { label: "W", action: "add('W')" },
    { label: "X", action: "add('X')" },
    { label: "Y", action: "add('Y')" },
    { label: "Z", action: "add('Z')" }
];

function renderKeys() {
    const container = document.getElementById("keys");
    if (!container) return;

    container.innerHTML = fullKeys
        .map(k => `<button onclick="${k.action}">${k.label}</button>`)
        .join("");
}

function hidePdfPanel() {
    const panel = document.getElementById("pdfPanel");
    const frame = document.getElementById("pdfFrame");
    const title = document.getElementById("pdfTitle");
    const openBtn = document.getElementById("openPdfBtn");
    const options = document.getElementById("pdfOptions");

    if (panel) panel.classList.add("hidden");
    if (frame) frame.src = "";
    if (title) title.innerText = "Datasheet";
    if (openBtn) openBtn.href = "#";
    if (options) options.innerHTML = "";
}

function showPdfPanel(pdfUrl, partNumber) {
    const panel = document.getElementById("pdfPanel");
    const frame = document.getElementById("pdfFrame");
    const title = document.getElementById("pdfTitle");
    const openBtn = document.getElementById("openPdfBtn");
    const options = document.getElementById("pdfOptions");

    if (title) title.innerText = `Datasheet: ${partNumber}`;
    if (frame) frame.src = pdfUrl;
    if (openBtn) openBtn.href = pdfUrl;
    if (options) options.innerHTML = "";
    if (panel) panel.classList.remove("hidden");
}

function updateActionButton() {
    const executeBtn = document.querySelector(".execute");
    if (!executeBtn) return;

    if (mode === "calc") {
        executeBtn.innerText = "CALCULAR";
        return;
    }

    if (mode === "semiconductor") {
        executeBtn.innerText = "CONSULTAR DATASHEET";
        return;
    }

    executeBtn.innerText = "CONVERTIR";
}

function setMode(m) {
    mode = m;

    const titles = {
        calc: "CALCULADORA",
        resistor: "RESISTENCIA",
        capacitor: "CAPACITOR",
        identify: "IDENTIFICAR",
        e96: "E96",
        semiconductor: "DATASHEET"
    };

    const images = {
        calc: "calculadora.png",
        resistor: "resistencia.png",
        capacitor: "capacitor.png",
        identify: "smd.png",
        e96: "e96.png",
        semiconductor: "transistor.png"
    };

    document.getElementById("modeIndicator").innerText = "MODO: " + titles[m];

    const img = document.getElementById("componentImg");
    const label = document.getElementById("componentName");

    if (img) img.src = `images/${images[m]}`;
    if (label) label.innerText = titles[m];

    document.getElementById("operation").innerText = "0";
    document.getElementById("result").innerText = "0";

    hidePdfPanel();
    renderKeys();
    updateActionButton();
}

async function run() {
    const value = document.getElementById("operation").innerText.trim();

    if (value === "0" && mode !== "calc") return;

    try {
        let out = "";

        if (mode === "resistor") {
            hidePdfPanel();
            out = decodeResistor(value);
            document.getElementById("result").innerText = out;
            return;
        }

        if (mode === "capacitor") {
            hidePdfPanel();
            out = decodeCapacitor(value);
            document.getElementById("result").innerText = out;
            return;
        }

        if (mode === "e96") {
            hidePdfPanel();
            out = decodeE96(value);
            document.getElementById("result").innerText = out;
            return;
        }

        if (mode === "identify") {
            hidePdfPanel();
            out = identify(value);
            document.getElementById("result").innerText = out;
            return;
        }

        if (mode === "semiconductor") {
            hidePdfPanel();
            document.getElementById("result").innerHTML = "🔎 Buscando...";

            const res = await searchSemiconductor(value);

            document.getElementById("result").innerHTML = res.html;

            if (res.useViewer && res.pdfUrl) {
                showPdfPanel(res.pdfUrl, value);
            } else {
                hidePdfPanel();
            }

            return;
        }

        if (mode === "calc") {
            hidePdfPanel();
            calculate();
            return;
        }

    } catch (e) {
        hidePdfPanel();
        document.getElementById("result").innerText = "Error: " + e.message;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderKeys();
    hidePdfPanel();
    updateActionButton();
});