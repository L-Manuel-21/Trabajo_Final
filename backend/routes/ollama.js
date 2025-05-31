const express = require('express');
const router = express.Router();
const axios = require('axios');

// Almacenamos aquí el historial de mensajes con Ollama (puedes cambiarlo por base de datos si quieres)
const historialOllama = [];

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'El prompt es requerido' });
  }

  // Acceder a socket.io desde el objeto app
  const io = req.app.get('io');

  try {
    const response = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'llama3.1:8b',  // Asegúrate de que esté instalado
        prompt: prompt,
        stream: false,
      },
      {
        timeout: 90000,
      }
    );

    if (!response.data || !response.data.response) {
      throw new Error('La respuesta de Ollama no tiene el formato esperado');
    }

    // Construimos el nuevo mensaje para el historial
    const nuevoMensaje = {
      prompt,
      respuesta: response.data.response,
      timestamp: new Date().toLocaleString(),
    };

    // Guardamos en el historial
    historialOllama.push(nuevoMensaje);

    // Emitimos todo el historial actualizado a los clientes conectados
    io.emit('historial_ollama', historialOllama);

    // Respondemos al cliente que hizo la petición
    res.json({
      respuesta: response.data.response,
      modelo_usado: response.data.model || 'llama3.1:8b',
    });

  } catch (error) {
    console.error('Error detallado:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    if (error.response?.data?.error?.includes("model") && error.response?.data?.error?.includes("not found")) {
      return res.status(400).json({
        error: 'Modelo no encontrado',
        detalles: 'Verifica si el modelo llama3.1:8b está instalado usando "ollama run llama3.1:8b" o "ollama pull llama3.1:8b"',
      });
    }

    res.status(500).json({
      error: 'Error al procesar tu solicitud',
      detalles: error.message,
    });
  }
});

module.exports = router;
