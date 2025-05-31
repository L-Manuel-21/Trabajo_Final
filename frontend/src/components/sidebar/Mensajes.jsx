// src/components/sidebar/Mensajes.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function Mensajes() {
  const [mensajes, setMensajes] = useState([]);
  const [respuesta, setRespuesta] = useState('');

  useEffect(() => {
    socket.on('intervencion_humana', (data) => {
      setMensajes((prev) => [...prev, data]);
    });

    return () => {
      socket.off('intervencion_humana');
    };
  }, []);

  const enviarRespuesta = (promptOriginal) => {
    if (!respuesta.trim()) return;

    const data = {
      promptOriginal,
      respuesta,
      timestamp: new Date().toLocaleString(),
    };

    socket.emit('respuesta_admin', data);
    setRespuesta('');
    alert('✅ Respuesta enviada al cliente');
  };

  return (
    <div>
      <h3>📨 Solicitudes de Atención Humana</h3>
      {mensajes.length === 0 ? (
        <p>No hay mensajes por el momento.</p>
      ) : (
        mensajes.map((msg, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
            <strong>{msg.timestamp}</strong>
            <p><em>{msg.prompt}</em></p>

            <input
              type="text"
              placeholder="Escribe una respuesta..."
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              style={{ width: '100%', marginBottom: 5 }}
            />
            <button onClick={() => enviarRespuesta(msg.prompt)}>Enviar respuesta</button>
          </div>
        ))
      )}
    </div>
  );
}
