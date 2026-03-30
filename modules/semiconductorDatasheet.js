/**
 * Lógica de conexión con el Servidor Cloud (Render)
 */
const API_URL = "https://juankalcula-api.onrender.com";

async function searchSemiconductor(partNumber) {
    const query = partNumber.toUpperCase().trim();
    const resultDiv = document.getElementById("result");
    
    // Mostramos un mensaje de carga mientras el servidor de Render "despierta"
    resultDiv.innerHTML = `<div style="color: #00ffc3; font-style: italic;">Buscando en la nube...</div>`;

    try {
        // Petición al servidor de Render
        const response = await fetch(`${API_URL}/api/semiconductors/${query}`);
        
        if (!response.ok) {
            throw new Error("No se encontró el componente");
        }

        const data = await response.json();
        
        // Construimos la respuesta visual profesional
        return {
            success: true,
            html: `
                <div style="border: 1px solid #00ffc3; padding: 15px; border-radius: 8px; background: rgba(0,255,195,0.05); text-align: left;">
                    <h3 style="color: #00ffc3; margin-top: 0;">${data.name}</h3>
                    <p style="color: #ccc; font-size: 13px;">${data.description}</p>
                    <hr style="border: 0; border-top: 1px solid #222; margin: 10px 0;">
                    <a href="${API_URL}${data.pdfUrl}" target="_blank" 
                       style="display: block; background: #00c853; color: white; text-align: center; 
                              padding: 12px; border-radius: 5px; text-decoration: none; font-weight: bold;
                              box-shadow: 0 4px 15px rgba(0,200,83,0.3);">
                       📄 ABRIR DATASHEET PDF
                    </a>
                </div>
            `
        };

    } catch (error) {
        console.error("Error API:", error);
        return { 
            success: false, 
            html: `
                <div style="color: #ff5252; padding: 10px; border: 1px solid #ff5252; border-radius: 5px;">
                    ⚠️ ${query} no encontrado en la base de datos local.
                    <br><br>
                    <a href="https://www.alldatasheet.com/view.jsp?SearchTerm=${query}" target="_blank" 
                       style="color: #00ffc3; text-decoration: underline;">
                       Buscar en base de datos global
                    </a>
                </div>
            `
        };
    }
}