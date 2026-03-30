/**
 * Lógica de búsqueda de Datasheets: JUANKALCULA PRO
 * 1. Busca en tu servidor propio (Render).
 * 2. Si no existe, ofrece búsqueda en bases de datos globales.
 */

const API_URL = "https://juankalcula-api.onrender.com";

export async function searchSemiconductor(partNumber) {
    const query = partNumber.toUpperCase().trim();
    
    // Validar que no esté vacío
    if (!query) {
        return { success: false, html: "<p style='color: #ff5252;'>⚠️ Por favor, ingresa un número de parte.</p>" };
    }

    try {
        // 1. INTENTO DE BÚSQUEDA LOCAL (Tu servidor Render)
        // Agregamos un timeout por si el servidor de Render está "durmiendo"
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de espera

        const response = await fetch(`${API_URL}/api/semiconductors/${query}`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            
            // ÉXITO: El componente está en tu JSON
            return {
                success: true,
                html: `
                    <div style="border: 2px solid #00ffc3; padding: 15px; border-radius: 10px; background: rgba(0,255,195,0.05); text-align: left;">
                        <h3 style="color: #00ffc3; margin: 0 0 10px 0;">✅ ${data.name} (Base Local)</h3>
                        <p style="color: #eee; font-size: 14px; line-height: 1.4;">${data.description}</p>
                        <hr style="border: 0; border-top: 1px dashed #333; margin: 15px 0;">
                        <a href="${API_URL}${data.pdfUrl}" target="_blank" 
                           style="display: block; background: #00c853; color: white; text-align: center; padding: 12px; border-radius: 5px; text-decoration: none; font-weight: bold; box-shadow: 0 4px 10px rgba(0,200,83,0.3);">
                           📄 ABRIR DATASHEET PDF
                        </a>
                    </div>
                `
            };
        }

        // Si el servidor responde 404 o cualquier error, lanzamos al modo "Global"
        throw new Error("No encontrado");

    } catch (error) {
        // 2. MODO RESPALDO: BÚSQUEDA EN EL NAVEGADOR (AllDataSheet / Google)
        return {
            success: true,
            html: `
                <div style="border: 1px solid #ffb300; padding: 15px; border-radius: 10px; background: rgba(255,179,0,0.05); text-align: center;">
                    <p style="color: #ffb300; margin: 0 0 10px 0; font-weight: bold;">⚠️ "${query}" no está en tu base local</p>
                    <p style="color: #aaa; font-size: 12px; margin-bottom: 15px;">¿Deseas buscarlo en la red global de fabricantes?</p>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <a href="https://www.alldatasheet.com/view.jsp?SearchTerm=${query}" target="_blank" 
                           style="background: #1976d2; color: white; text-align: center; padding: 10px; border-radius: 5px; text-decoration: none; font-size: 13px; font-weight: bold; display: flex; align-items: center; justify-content: center;">
                           🔍 AllDataSheet
                        </a>
                        <a href="https://www.google.com/search?q=${query}+datasheet+pdf" target="_blank" 
                           style="background: #424242; color: white; text-align: center; padding: 10px; border-radius: 5px; text-decoration: none; font-size: 13px; font-weight: bold; display: flex; align-items: center; justify-content: center;">
                           🌐 Google PDF
                        </a>
                    </div>
                    
                    <p style="margin-top: 15px; font-size: 11px; color: #666;">Tip: Los servidores gratuitos pueden tardar 30s en despertar.</p>
                </div>
            `
        };
    }
}