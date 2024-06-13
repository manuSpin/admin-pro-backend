require('dotenv').config();
const express = require('express');
const { dbConnection } = require('./database/config');
var cors = require('cors');

// Crear el servidor
const app = express();

// Configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Base de datos
dbConnection();

// Rutas
app.use('/api/usuarios', require('./routes/usuarios.route'));
app.use('/api/hospitales', require('./routes/hospitales.route'));
app.use('/api/medicos', require('./routes/medicos.route'));
app.use('/api/todo', require('./routes/busquedas.route'));
app.use('/api/login', require('./routes/auth.route'));
app.use('/api/uploads', require('./routes/uploads.route'));


app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});