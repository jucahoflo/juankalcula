const API_URL = "https://juankalcula-api.onrender.com";

export async function searchSemiconductor(partNumber) {
    const query = partNumber.toUpperCase().trim();
    try {
        const response = await fetch(`${API_URL}/api/semiconductors/${query}`);
        
        if (response.ok) {
            const data = await response.json();
            return {
                success: true,
                html: `
                    <div style="border: 1px solid #00ffc3; padding: 10px; border-radius: 5px; text-align: left; background: rgba(0,255,195,0.05);">
                        <h3 style="color: #00ffc3; margin: 0;">✅ ${data.name}</h3>
                        <p style="color: #ccc; font-size: 13px; margin: 5px 0;">${data.description}</p>
                        <a href="${API_URL}${data.pdfUrl}" target="_blank" 
                           style="display: block; background: #00c853; color: white; text-align: center; padding: 10px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 10px;">
                           📄 ABRIR PDF
                        </a>
                    </div>`
            };
        }
        throw new Error();
    } catch (error) {
        // Si no está en local, ofrece buscar en AllDataSheet
        return {
            success: true,
            html: `
                <div style="border: 1px solid #ffb300; padding: 10px; border-radius: 5px; text-align: center; background: rgba(255,179,0,0.05);">
                    <p style="color: #ffb300; margin-bottom: 10px;">⚠️ No hallado en base local</p>
                    <a href="https://www.alldatasheet.com/view.jsp?SearchTerm=${query}" target="_blank" 
                       style="display: inline-block; background: #1976d2; color: white; padding: 8px 15px; border-radius: 4px; text-decoration: none; font-weight: bold;">
                       🔍 Buscar en AllDataSheet
                    </a>
                </div>`
        };
    }
}