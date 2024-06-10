require('dotenv').config();
const express = require('express');
const { dbConnection } = require('./database/config');
var cors = require('cors');

// Crear el servidor
const app = express();

// Configurar CORS
app.use(cors());

// Base de datos
dbConnection();


// Rutas
app.get('/', (request, response) => {
    response.json({ ok: true, msg: 'Hola mundo' });
});

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});