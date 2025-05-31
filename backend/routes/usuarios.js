const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Administrador = require('../models/Administrador'); // Importamos admin
const bcrypt = require('bcryptjs');

// Registro de usuario o administrador
router.post('/registro', async (req, res) => {
  const { nombre, correo, telefono, contrasena } = req.body;

  try {
    // Verificar si ya existe en usuarios o admins
    let usuarioExistente = await Usuario.findOne({ correo });
    let adminExistente = await Administrador.findOne({ correo });

    if (usuarioExistente || adminExistente) {
      return res.status(400).json({ msg: 'El correo ya está registrado' });
    }

    // Detectar si es admin por dominio de correo
    const esAdmin = correo.toLowerCase().endsWith('@ecoventas.com');

    const salt = await bcrypt.genSalt(10);
    const contrasenaHash = await bcrypt.hash(contrasena, salt);

    if (esAdmin) {
      const nuevoAdmin = new Administrador({
        nombre,
        correo,
        telefono,
        contrasena: contrasenaHash,
      });
      await nuevoAdmin.save();
      return res.status(201).json({ msg: 'Administrador creado correctamente' });
    } else {
      const nuevoUsuario = new Usuario({
        nombre,
        correo,
        telefono,
        contrasena: contrasenaHash,
      });
      await nuevoUsuario.save();
      return res.status(201).json({ msg: 'Usuario creado correctamente' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

// Login de usuario o administrador
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    // Buscar primero en admins
    let usuario = await Administrador.findOne({ correo });
    let esAdmin = false;

    if (!usuario) {
      // Buscar en usuarios
      usuario = await Usuario.findOne({ correo });
      if (!usuario) {
        return res.status(404).json({ msg: 'Usuario no encontrado' });
      }
    } else {
      esAdmin = true;
    }

    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValida) {
      return res.status(401).json({ msg: 'Contraseña incorrecta' });
    }

    res.status(200).json({
      msg: 'Login exitoso',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
        esAdmin,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al iniciar sesión' });
  }
});

// Obtener todos los usuarios (solo usuarios normales, no admins)
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-contrasena');
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los usuarios' });
  }
});

// Eliminar un usuario (solo usuarios normales)
router.delete('/:id', async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar usuario' });
  }
});

// Actualizar un usuario (solo usuarios normales)
router.put('/:id', async (req, res) => {
  const { nombre, correo, telefono } = req.body;
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre, correo, telefono },
      { new: true }
    );
    res.json(usuarioActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar usuario' });
  }
});

module.exports = router;
