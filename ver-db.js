const db = require('./database');

db.all(`SELECT * FROM destinos`, [], (err, rows) => {
    if (err) {
        console.error('Error al obtener datos:', err.message);
    } else {
        console.log('Contenido de la base de datos:', rows);
    }
    db.close(); 
});
