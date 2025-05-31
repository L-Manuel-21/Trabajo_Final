const mongoose = require('mongoose');

const administradorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  contrasena: {
    type: String,
    required: true,
  },
});

// Aquí indicamos que la colección se llame "administradores"
module.exports = mongoose.model('Administrador', administradorSchema, 'administradores');
