import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Configuración para obtener rutas en módulos ES (import/export)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- MIDDLEWARES ---
// CORS es Vital: Permite que tu web en GitHub Pages consulte este servidor
app.use(cors());
app.use(express.json());

// --- SERVIR ARCHIVOS ESTÁTICOS ---
// Esto permite que al acceder a juankalcula-api.onrender.com/datasheets/2n2222.pdf se abra el archivo
const datasheetsPath = path.join(__dirname, '../datasheets');
app.use('/datasheets', express.static(datasheetsPath));

// --- RUTAS DE LA API ---

// 1. Ruta de prueba para verificar que el servidor está vivo
app.get('/', (req, res) => {
    res.send('🚀 Servidor JUANKALCULA API funcionando en la nube');
});

// 2. Buscador de Semiconductores
app.get('/api/semiconductors/:id', (req, res) => {
    const id = req.params.id.toUpperCase().trim();
    
    // Ruta hacia tu archivo JSON de base de datos
    const dataPath = path.join(__dirname, '../data/semiconductors.json');
    
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error al leer base de datos:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
        
        try {
            const semiconductors = JSON.parse(data);
            const component = semiconductors.find(s => s.name === id);
            
            if (component) {
                // Devolvemos el objeto del componente encontrado
                res.json(component);
            } else {
                res.status(404).json({ error: "Componente no encontrado" });
            }
        } catch (parseError) {
            res.status(500).json({ error: "Error al procesar base de datos" });
        }
    });
});

// --- ARRANQUE DEL SERVIDOR ---
// Render asigna un puerto dinámico mediante process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
    ===========================================
    ✅ SERVIDOR JUANKALCULA PRO ACTIVO
    📡 Puerto: ${PORT}
    📂 Datasheets: ${datasheetsPath}
    ===========================================
    `);
});