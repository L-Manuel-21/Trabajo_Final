import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DashboardInvitado.css'; // Archivo CSS separado

export default function DashboardInvitado() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/productos');
        setProductos(res.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };
    obtenerProductos();
  }, []);

  const toggleAiAssistant = () => {
    setAiAssistantOpen(!aiAssistantOpen);
    if (!aiAssistantOpen && aiMessages.length === 0) {
      setAiMessages([{
        sender: 'assistant',
        text: 'Hola, soy tu asistente de productos. ¿En qué puedo ayudarte?'
      }]);
    }
  };

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || aiLoading) return;

    const newUserMessage = { sender: 'user', text: userInput };
    setAiMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setAiLoading(true);

    const mensajeLimpio = userInput.replace(/^Tú:\s*/i, '');

    const listaProductos = productos.map(p =>
      `${p.nombre}: $${p.precio}`
    ).join(', ');

    const prompt = `
Eres un asistente virtual amable y experto en productos.
Un invitado ha preguntado: "${mensajeLimpio}".
Estos son los productos disponibles con sus precios: ${listaProductos}.
Responde de forma clara y directa mostrando solo el nombre y precio de los productos si es pertinente.
    `.trim();

    try {
      const response = await axios.post('http://localhost:5000/api/ollama', { prompt });
      const respuestas = response.data.respuesta
        .split('\n\n')
        .map(res => res.trim())
        .filter(res => res !== '');

      setAiMessages(prev => [
        ...prev,
        ...respuestas.map(text => ({ sender: 'assistant', text }))
      ]);
    } catch (error) {
      setAiMessages(prev => [...prev, {
        sender: 'assistant',
        text: 'Lo siento, no pude responder en este momento.'
      }]);
    } finally {
      setAiLoading(false);
    }
  };

  const irALogin = () => {
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <button 
        onClick={irALogin} 
        className="login-button"
      >
        Iniciar Sesión
      </button>

      <h1 className="dashboard-title">Bienvenido Invitado</h1>
      <h2 className="dashboard-subtitle">Productos disponibles</h2>

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="product-grid">
          {productos.map(producto => (
            <div key={producto._id} className="product-card">
              <h3 className="product-name">{producto.nombre}</h3>
              <p className="product-price">Precio: <span>${producto.precio}</span></p>
            </div>
          ))}
        </div>
      )}

      {/* Botón de IA flotante */}
      <button 
        onClick={toggleAiAssistant}
        className={`ai-button ${aiAssistantOpen ? 'ai-button-active' : ''}`}
      >
        AI
      </button>

      {/* Panel de IA */}
      {aiAssistantOpen && (
        <div className="ai-panel">
          <div className="ai-header">
            <h3 className="ai-title">Asistente de IA</h3>
            <button 
              onClick={toggleAiAssistant}
              className="ai-close-button"
            >
              ×
            </button>
          </div>

          <div className="ai-messages-container">
            {aiMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`ai-message ${msg.sender === 'assistant' ? 'assistant-message' : 'user-message'}`}
              >
                <strong>{msg.sender === 'assistant' ? 'Asistente:' : 'Tú:'}</strong> {msg.text}
              </div>
            ))}
            {aiLoading && (
              <div className="ai-loading">
                <div className="ai-loading-dot"></div>
                <div className="ai-loading-dot"></div>
                <div className="ai-loading-dot"></div>
              </div>
            )}
          </div>

          <form onSubmit={handleAiSubmit} className="ai-form">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Escribe algo..."
              className="ai-input"
              disabled={aiLoading}
              autoFocus
            />
            <button 
              type="submit" 
              disabled={aiLoading || !userInput.trim()}
              className="ai-submit-button"
            >
              {aiLoading ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}