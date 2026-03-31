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
                    <div style="border: 1px solid #00ffc3; padding: 10px; border-radius: 8px; background: rgba(0,255,195,0.05); margin-top: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <h3 style="color: #00ffc3; margin: 0; font-size: 16px;">✅ ${data.name}</h3>
                            <a href="${pdfFullUrl}" target="_blank" style="background: #00c853; color: white; padding: 5px 12px; border-radius: 5px; text-decoration: none; font-size: 12px; font-weight: bold;">ABRIR PDF ↗</a>
                        </div>
                        <p style="color: #ccc; font-size: 13px; margin-bottom: 10px;">${data.description}</p>
                        <div style="width: 100%; height: 350px; border-radius: 5px; overflow: hidden; border: 1px solid #333; background: #fff;">
                            <iframe src="${pdfFullUrl}" style="width: 100%; height: 100%; border: none;"></iframe>
                        </div>
                    </div>`
            };
        }
        throw new Error();
    } catch (error) {
        const externalUrl = `https://www.alldatasheet.com/view.jsp?SearchTerm=${query}`;
        return {
            success: true,
            html: `
                <div style="border: 1px solid #ffb300; padding: 15px; border-radius: 8px; text-align: center; background: rgba(255,179,0,0.05); margin-top: 10px;">
                    <p style="color: #ffb300; margin-bottom: 10px; font-weight: bold;">⚠️ No en base local. Buscando en AllDataSheet...</p>
                    <div style="width: 100%; height: 300px; border-radius: 5px; overflow: hidden; border: 1px solid #333; background: #fff; margin-bottom: 10px;">
                        <iframe src="${externalUrl}" style="width: 100%; height: 100%; border: none;"></iframe>
                    </div>
                    <a href="${externalUrl}" target="_blank" style="color: #00ffc3; text-decoration: underline; font-size: 13px;">Ver en pantalla completa</a>
                </div>`
        };
    }
}