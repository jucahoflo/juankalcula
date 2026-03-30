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
                    <div style="border: 1px solid #00ffc3; padding: 10px; border-radius: 5px; text-align: left;">
                        <h3 style="color: #00ffc3; margin: 0;">${data.name}</h3>
                        <p style="color: #ccc; font-size: 13px;">${data.description}</p>
                        <a href="${API_URL}${data.pdfUrl}" target="_blank" 
                           style="display: block; background: #00c853; color: white; text-align: center; padding: 10px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 10px;">
                           📄 VER DATASHEET
                        </a>
                    </div>`
            };
        }
        throw new Error();
    } catch (error) {
        // FALLBACK: Si no existe en tu servidor, lo busca en la red global
        return {
            success: true,
            html: `
                <div style="border: 1px solid #ffb300; padding: 10px; border-radius: 5px; text-align: center;">
                    <p style="color: #ffb300; margin-bottom: 10px;">No hallado en base local</p>
                    <a href="https://www.alldatasheet.com/view.jsp?SearchTerm=${query}" target="_blank" 
                       style="display: inline-block; background: #1976d2; color: white; padding: 8px 15px; border-radius: 4px; text-decoration: none; font-weight: bold;">
                       🔍 AllDataSheet
                    </a>
                </div>`
        };
    }
}