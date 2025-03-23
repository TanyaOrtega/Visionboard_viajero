const express = require('express');
const path = require('path');
const cors = require('cors');
const sequelize = require('./database');
const Destino = require('./models/destino'); 

const app = express();
app.use(cors());
app.use(express.json());

// Servir los archivos estáticos (CSS, JS, imágenes) desde la carpeta frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Ruta para servir index.html desde la carpeta frontend cuando se accede a la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));  // Servir el index.html desde frontend/
});

// CRUD

// Obtener todos los destinos
app.get('/destinos', async (req, res) => {
    try {
        const destinos = await Destino.findAll();
        res.json(destinos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener destinos' });
    }
});

// Obtener un destino por ID
app.get('/destinos/:id', async (req, res) => {
    try {
        const destino = await Destino.findByPk(req.params.id);
        if (!destino) {
            return res.status(404).json({ error: "Destino no encontrado" });
        }
        res.json(destino);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el destino' });
    }
});

// Crear un nuevo destino
app.post('/destinos', async (req, res) => {
    try {
        const nuevoDestino = await Destino.create(req.body);
        res.status(201).json(nuevoDestino);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el destino' });
    }
});

// Actualizar un destino
app.put('/destinos/:id', async (req, res) => {
    try {
        const destino = await Destino.findByPk(req.params.id);
        if (!destino) {
            return res.status(404).json({ error: 'Destino no encontrado' });
        }
        await destino.update(req.body);
        res.json(destino);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el destino' });
    }
});

// Eliminar un destino
app.delete('/destinos/:id', async (req, res) => {
    try {
        const destino = await Destino.findByPk(req.params.id);
        if (!destino) {
            return res.status(404).json({ error: 'Destino no encontrado' });
        }
        await destino.destroy();
        res.json({ mensaje: 'Destino eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el destino' });
    }
});

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');

        await sequelize.sync({ force: false }); // Cambia a `true` solo si quieres borrar y recrear las tablas
        console.log('✅ Base de datos sincronizada.');

        const PORT = process.env.PORT || 3000; // Cambiar para usar un puerto dinámico en producción
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
    }
}

startServer();
