const API_URL = "https://juankalcula-api.onrender.com";

window.searchSemiconductor = async function(partNumber) {
    if (!partNumber) {
        return buildError("Ingresa un componente válido");
    }

    const query = normalizePartNumber(partNumber);

    try {
        const response = await fetch(`${API_URL}/api/semiconductors/${query}`);

        if (!response.ok) {
            throw new Error("Not found in API");
        }

        const data = await response.json();
        const fullPdfUrl = `${API_URL}${data.pdfUrl}`;

        return {
            success: true,
            pdfUrl: fullPdfUrl,
            html: buildLocalResult(data, fullPdfUrl)
        };
    } catch (error) {
        return {
            success: true,
            pdfUrl: null,
            html: buildFallback(query)
        };
    }
};

function normalizePartNumber(input) {
    return input
        .toUpperCase()
        .trim()
        .replace(/\s+/g, "")
        .replace(/[^A-Z0-9]/g, "");
}

function buildLocalResult(data, pdfUrl) {
    return `
        <div style="border: 1px solid #00ffc3; padding: 10px; border-radius: 5px; text-align: left; background: rgba(0,255,195,0.05);">
            <h3 style="color: #00ffc3; margin: 0;">✅ ${data.name}</h3>
            <p style="color: #ccc; font-size: 13px; margin: 5px 0;">${data.description || "Sin descripción"}</p>

            <a href="${pdfUrl}" target="_blank"
               style="display: block; background: #00c853; color: white; text-align: center; padding: 10px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 10px;">
               📄 ABRIR PDF
            </a>
        </div>
    `;
}

function buildFallback(query) {
    const url = `https://www.alldatasheet.com/view.jsp?Searchword=${encodeURIComponent(query)}`;

    return `
        <div style="border: 1px solid #ffb300; padding: 10px; border-radius: 5px; text-align: center; background: rgba(255,179,0,0.05);">
            <p style="color: #ffb300; margin-bottom: 10px;">⚠️ No hallado en base local</p>

            <a href="${url}" target="_blank"
               style="display: inline-block; background: #1976d2; color: white; padding: 8px 15px; border-radius: 4px; text-decoration: none; font-weight: bold;">
               🔍 Buscar en AllDataSheet
            </a>
        </div>
    `;
}

function buildError(message) {
    return {
        success: false,
        pdfUrl: null,
        html: `
            <div style="color: #ff5252; text-align: center;">
                ❌ ${message}
            </div>
        `
    };
}