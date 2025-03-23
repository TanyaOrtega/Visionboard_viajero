const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const Destino = require('./models/destino'); 

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;"
    );
    next();
});


async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');

        await sequelize.sync({ force: false }); 
        console.log('✅ Base de datos sincronizada.');

        // Usar el puerto dinámico de Render
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
    }
}

startServer();

// Ruta raíz para evitar el error "Cannot GET /"
app.get("/", (req, res) => {
    res.send("¡Bienvenido a Visionboard Viajero API!");
});

// CRUD de Destinos
app.get('/destinos', async (req, res) => {
    try {
        const destinos = await Destino.findAll();
        res.json(destinos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener destinos' });
    }
});

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

app.post('/destinos', async (req, res) => {
    try {
        const nuevoDestino = await Destino.create(req.body);
        res.status(201).json(nuevoDestino);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el destino' });
    }
});

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
