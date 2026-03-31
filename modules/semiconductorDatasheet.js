const API_URL = "https://juankalcula-api.onrender.com";

window.searchSemiconductor = async function(partNumber) {
    if (!partNumber) {
        return buildError("Ingresa un componente válido");
    }

    const query = normalizePartNumber(partNumber);

    try {
        const response = await fetch(`${API_URL}/api/semiconductors/${query}`);

        if (!response.ok) {
            throw new Error("No encontrado en API");
        }

        const data = await response.json();
        const fullPdfUrl = `${API_URL}${data.pdfUrl}`;

        return {
            success: true,
            useViewer: true,
            pdfUrl: fullPdfUrl,
            html: buildLocalResult(data, fullPdfUrl)
        };
    } catch (error) {
        const sources = buildSources(query);

        return {
            success: true,
            useViewer: false,
            pdfUrl: null,
            html: buildSourcesResult(query, sources)
        };
    }
};

function normalizePartNumber(input) {
    return input
        .toUpperCase()
        .trim()
        .replace(/\s+/g, "")
        .replace(/[^A-Z0-9\-]/g, "");
}

function buildSources(query) {
    return [
        {
            label: "AllDataSheet",
            url: `https://www.alldatasheet.com/view.jsp?Searchword=${encodeURIComponent(query)}`
        },
        {
            label: "Datasheet4U",
            url: `https://datasheet4u.com/share_search.php?sWord=${encodeURIComponent(query)}`
        },
        {
            label: "Components101",
            url: `https://components101.com/search/node?keys=${encodeURIComponent(query)}`
        },
        {
            label: "RG Electrics",
            url: `https://rgelectrics.com/?s=${encodeURIComponent(query)}`
        },
        {
            label: "Google Datasheet",
            url: `https://www.google.com/search?q=${encodeURIComponent(query + " datasheet pdf")}`
        }
    ];
}

function buildLocalResult(data, pdfUrl) {
    return `
        <div style="border: 1px solid #00ffc3; padding: 10px; border-radius: 5px; text-align: left; background: rgba(0,255,195,0.05);">
            <h3 style="color: #00ffc3; margin: 0;">✅ ${escapeHtml(data.name || "Componente encontrado")}</h3>
            <p style="color: #ccc; font-size: 13px; margin: 5px 0;">${escapeHtml(data.description || "Sin descripción")}</p>

            <a href="${pdfUrl}" target="_blank"
               style="display: block; background: #00c853; color: white; text-align: center; padding: 10px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 10px;">
               📄 ABRIR PDF
            </a>
        </div>
    `;
}

function buildSourcesResult(query, sources) {
    const links = sources.map(source => `
        <a href="${source.url}" target="_blank" rel="noopener noreferrer"
           style="display:block; margin:8px 0; background:#1976d2; color:white; text-align:center; padding:10px; border-radius:5px; text-decoration:none; font-weight:bold;">
           🔍 ${source.label}
        </a>
    `).join("");

    return `
        <div style="border: 1px solid #ffb300; padding: 12px; border-radius: 5px; text-align: center; background: rgba(255,179,0,0.05);">
            <p style="color: #ffb300; margin-bottom: 10px;">⚠️ No hallado en base local</p>
            <p style="color: #ccc; font-size: 12px; margin-bottom: 12px;">
                Selecciona una fuente para buscar el datasheet de <strong>${escapeHtml(query)}</strong>
            </p>
            ${links}
        </div>
    `;
}

function buildError(message) {
    return {
        success: false,
        useViewer: false,
        pdfUrl: null,
        html: `
            <div style="color: #ff5252; text-align: center;">
                ❌ ${escapeHtml(message)}
            </div>
        `
    };
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}