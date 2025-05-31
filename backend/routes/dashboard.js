const express = require('express');
const router = express.Router();

// Importar modelos
const Producto = require('../models/producto');
const Usuario = require('../models/Usuario');
const Compra = require('../models/Compra');

router.get('/resumen', async (req, res) => {
  try {
    // Obtener total productos
    const totalProductos = await Producto.countDocuments();

    // Obtener total clientes (usuarios)
    const totalClientes = await Usuario.countDocuments();

    // Obtener total ventas
    const totalVentas = await Compra.countDocuments();

    // Obtener ventas hoy
    // Suponemos que el campo de fecha en Compra es 'createdAt'
    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date();
    finDia.setHours(23, 59, 59, 999);

    const ventasHoy = await Compra.countDocuments({
      createdAt: { $gte: inicioDia, $lte: finDia }
    });

    res.json({
      totalProductos,
      totalClientes,
      totalVentas,
      ventasHoy
    });
  } catch (error) {
    console.error('Error al obtener resumen del dashboard:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
