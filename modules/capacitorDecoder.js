/**
 * Decodificador Profesional de Capacitores
 * Entrega resultados en pF, nF y µF automáticamente.
 */
function decodeCapacitor(code) {
    let c = code.trim().toUpperCase();
    if (!c || c === "0") return "0 pF";

    // 1. Mapeo de Tolerancias
    const lastChar = c.slice(-1);
    let tolerance = "";
    const tolMap = { 
        'J': ' (±5%)', 'K': ' (±10%)', 'M': ' (±20%)',
        'G': ' (±2%)', 'F': ' (±1%)', 'D': ' (±0.5pF)'
    };

    if (tolMap[lastChar] && c.length > 1) {
        tolerance = tolMap[lastChar];
        c = c.slice(0, -1);
    }

    let pF = 0;

    // 2. Identificar el tipo de código ingresado
    if (/^\d{3}$/.test(c)) {
        // Código de 3 dígitos (ej: 104)
        const base = parseInt(c.substring(0, 2));
        const exp = parseInt(c.substring(2));
        pF = base * Math.pow(10, exp);
    } 
    else if (/^\d{1,2}$/.test(c)) {
        // Valor directo en pF (ej: 47)
        pF = parseInt(c);
    }
    else {
        // Valores con punto decimal o R (ej: 2.2 o 4R7)
        const decimalVal = c.replace('R', '.');
        pF = parseFloat(decimalVal);
    }

    if (isNaN(pF)) throw new Error("Código no válido");

    // 3. RETORNAR TODAS LAS UNIDADES
    return formatCapacitorUnits(pF) + tolerance;
}

function formatCapacitorUnits(pf) {
    if (pf < 1000) {
        return pf.toFixed(0) + " pF";
    }

    const nf = pf / 1000;
    const uf = pf / 1000000;

    // Si es un valor común de nF (como 100nF)
    if (pf >= 1000 && pf < 1000000) {
        return `${nf.toFixed(2)} nF | ${uf.toFixed(4)} µF`;
    } 
    
    // Si es un valor de Microfaradios (como 10uF)
    return `${uf.toFixed(2)} µF | ${nf.toFixed(0)} nF`;
}