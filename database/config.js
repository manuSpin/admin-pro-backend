const mongoose = require('mongoose');


const dbConnection = async() => {
    try {
        mongoose.connect('mongodb+srv://admin:admin@cluster0.xgofadg.mongodb.net/hospitalDB');
        console.log('BD Online');

    } catch (error) {
        console.error(Error);
        throw new Error('Error a la hora de iniciar la BD');
    }
}

module.exports = {
    dbConnection: dbConnection
}