const API_URL = "https://juankalcula-api.onrender.com";

export async function searchSemiconductor(partNumber) {
    const query = partNumber.toUpperCase().trim();
    try {
        const response = await fetch(`${API_URL}/api/semiconductors/${query}`);
        
        if (response.ok) {
            const data = await response.json();
            const pdfFullUrl = `${API_URL}${data.pdfUrl}`;
            
            return {
                success: true,
                html: `
                    <div style="border: 1px solid #00ffc3; padding: 10px; border-radius: 5px; text-align: left; background: rgba(0,255,195,0.05); display: flex; flex-direction: column; gap: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h3 style="color: #00ffc3; margin: 0;">✅ ${data.name}</h3>
                            <a href="${pdfFullUrl}" target="_blank" 
                               style="background: #00c853; color: white; padding: 5px 10px; border-radius: 4px; text-decoration: none; font-size: 11px; font-weight: bold;">
                               EXTERNO ↗
                            </a>
                        </div>
                        <p style="color: #ccc; font-size: 13px; margin: 0;">${data.description}</p>
                        
                        <div style="width: 100%; height: 350px; border-radius: 4px; overflow: hidden; border: 1px solid #333; background: #000;">
                            <iframe src="${pdfFullUrl}" style="width: 100%; height: 100%; border: none;"></iframe>
                        </div>
                    </div>`
            };
        }
        throw new Error();
    } catch (error) {
        // Búsqueda en AllDataSheet si no está en tu servidor
        const externalUrl = `https://www.alldatasheet.com/view.jsp?SearchTerm=${query}`;
        return {
            success: true,
            html: `
                <div style="border: 1px solid #ffb300; padding: 10px; border-radius: 5px; text-align: center; background: rgba(255,179,0,0.05);">
                    <p style="color: #ffb300; margin-bottom: 10px;">⚠️ No hallado en base local</p>
                    
                    <div style="width: 100%; height: 300px; border-radius: 4px; overflow: hidden; border: 1px solid #333; margin-bottom: 10px;">
                         <iframe src="${externalUrl}" style="width: 100%; height: 100%; border: none;"></iframe>
                    </div>

                    <a href="${externalUrl}" target="_blank" 
                       style="display: inline-block; background: #1976d2; color: white; padding: 8px 15px; border-radius: 4px; text-decoration: none; font-weight: bold;">
                       🔍 Abrir AllDataSheet completo
                    </a>
                </div>`
        };
    }
}