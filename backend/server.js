const express = require('express');
const cors = require('cors');
require('dotenv').config();
const conectarDB = require('./config/db');

const app = express();
const http = require('http'); // Usamos http para integrar con Socket.io
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*', // Cambia esto si tienes una URL específica en producción
    methods: ['GET', 'POST']
  }
});

// Guardamos io en app para usarlo en rutas
app.set('io', io);

// Conectar a la base de datos
conectarDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/compras', require('./routes/compras'));
app.use('/api/ollama', require('./routes/ollama'));
app.use('/api/dashboard', require('./routes/dashboard')); // Ruta del chatbot

// Ruta base
app.get('/', (req, res) => {
  res.send('API funcionando');
});

// Evento de conexión de sockets
io.on('connection', (socket) => {
  console.log('🔌 Cliente conectado vía Socket.io');

  // Cliente solicita atención humana
  socket.on('intervencion_humana', (data) => {
    console.log('🆘 Solicitud de atención humana:', data);

    // Se lo mandamos al panel del admin
    io.emit('intervencion_humana', {
      prompt: data.prompt,
      timestamp: new Date().toLocaleString(),
    });
  });

  // Admin responde al cliente
  socket.on('respuesta_admin', (data) => {
    console.log('💬 Respuesta del admin:', data);

    // Enviamos la respuesta al cliente
    io.emit('respuesta_para_cliente', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado');
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
