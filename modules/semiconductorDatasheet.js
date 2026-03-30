const API_URL = "https://juankalcula-api.onrender.com";

export async function searchSemiconductor(partNumber) {
    const query = partNumber.toUpperCase().trim();

    try {
        // Intentar conectar con tu servidor en Render
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos de espera

        const response = await fetch(`${API_URL}/api/semiconductors/${query}`, { 
            signal: controller.signal 
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            return {
                success: true,
                html: `
                    <div style="border: 2px solid #00ffc3; padding: 15px; border-radius: 10px; background: rgba(0,255,195,0.05); text-align: left;">
                        <h3 style="color: #00ffc3; margin: 0 0 10px 0;">✅ ${data.name} (Base Local)</h3>
                        <p style="color: #eee; font-size: 14px;">${data.description}</p>
                        <a href="${API_URL}${data.pdfUrl}" target="_blank" 
                           style="display: block; background: #00c853; color: white; text-align: center; padding: 12px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 15px; box-shadow: 0 4px 10px rgba(0,200,83,0.3);">
                           📄 ABRIR DATASHEET PDF
                        </a>
                    </div>
                `
            };
        }
        throw new Error("No encontrado");

    } catch (error) {
        // SISTEMA DE RESPALDO: Si no está en tu servidor, busca en la web
        return {
            success: true,
            html: `
                <div style="border: 1px solid #ffb300; padding: 15px; border-radius: 10px; background: rgba(255,179,0,0.05); text-align: center;">
                    <p style="color: #ffb300; margin: 0 0 10px 0; font-weight: bold;">🔍 "${query}" no está en tu base local</p>
                    <p style="color: #aaa; font-size: 12px; margin-bottom: 15px;">¿Deseas buscarlo en la red global?</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <a href="https://www.alldatasheet.com/view.jsp?SearchTerm=${query}" target="_blank" 
                           style="background: #1976d2; color: white; text-align: center; padding: 10px; border-radius: 5px; text-decoration: none; font-size: 13px; font-weight: bold;">
                           AllDataSheet
                        </a>
                        <a href="https://www.google.com/search?q=${query}+datasheet+pdf" target="_blank" 
                           style="background: #424242; color: white; text-align: center; padding: 10px; border-radius: 5px; text-decoration: none; font-size: 13px; font-weight: bold;">
                           Google PDF
                        </a>
                    </div>
                </div>
            `
        };
    }
}