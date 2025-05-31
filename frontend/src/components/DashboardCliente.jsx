import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DashboardCliente.css';

function DashboardCliente() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Verificar sesión al cargar el componente
  useEffect(() => {
    const nombreGuardado = localStorage.getItem('nombreUsuario');
    if (!nombreGuardado) {
      // Redirigir inmediatamente si no hay sesión
      navigate('/', { replace: true });
      return;
    }

    setNombre(nombreGuardado || 'cliente');

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

    // Configurar evento para limpiar sesión al recargar/cerrar pestaña
  }, [navigate]);

  const handleCerrarSesion = () => {
    // Limpiar localStorage y redirigir con replace para evitar historial
    localStorage.removeItem('nombreUsuario');
    navigate('/', { replace: true });
    
    // Forzar recarga completa para limpiar el estado de la aplicación
    window.location.reload();
  };

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p._id === producto._id);
      if (existe) {
        return prev.map((p) =>
          p._id === producto._id && p.cantidad < producto.stock
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  const quitarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((p) => p._id !== id));
  };

  const aumentarCantidad = (id) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item._id === id && item.cantidad < item.stock
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  const disminuirCantidad = (id) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item._id === id && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
    );
  };

  const finalizarCompra = async () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const productosCompra = carrito.map(({ _id, nombre, precio, cantidad }) => ({
      productoId: _id,
      nombre,
      precio,
      cantidad,
    }));

    const total = productosCompra.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    const compra = {
      usuario: nombre,
      productos: productosCompra,
      total,
      fecha: new Date(),
    };

    try {
      await axios.post('http://localhost:5000/api/compras', compra);
      alert('Compra realizada con éxito');
      setCarrito([]);
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
      alert('Ocurrió un error al finalizar la compra');
    }
  };

  const toggleAiAssistant = () => {
    setAiAssistantOpen(!aiAssistantOpen);
    if (!aiAssistantOpen && aiMessages.length === 0) {
      setAiMessages([{
        sender: 'assistant',
        text: '¡Hola! Soy tu asistente de compras. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre productos, recomendaciones o ayuda con tu carrito.'
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

  // Detectar pregunta por RUC en frontend
  const preguntaLower = userInput.toLowerCase();
  if (preguntaLower.includes('ruc')) {
    // Generar o poner un RUC fijo (ejemplo)
    const rucSimulado = '20123456789'; // puedes cambiarlo o generarlo dinámicamente
    setAiMessages(prev => [...prev, {
      sender: 'assistant',
      text: `El RUC es: ${rucSimulado}`
    }]);
    setAiLoading(false);
    return;
  }

  // Si no es pregunta por RUC, envía a Ollama
  try {
    const totalProductos = productos.length;

    const response = await axios.post('http://localhost:5000/api/ollama', {
      prompt: `
      Eres un asistente virtual experto en productos de una tienda en línea. 
      Actualmente, tenemos un total de ${totalProductos} productos disponibles en nuestra tienda.
      El usuario ha preguntado: "${userInput}".
      Estos son los productos disponibles con su nombre, precio (en dólares) y descripción:
      ${productos.map(p => `${p.nombre} ($${p.precio.toFixed(2)}): ${p.descripcion}`).join('\n')}

      Cuando te pregunten "¿cuántos productos tienes?" o cualquier consulta similar, responde usando el número exacto ${totalProductos}. No inventes cantidades.
      Responde de manera clara, precisa y directa, mencionando solo los productos que sean relevantes para la pregunta del usuario. No incluyas información sobre carritos ni otros detalles irrelevantes.
            `.trim()
      });

    setAiMessages(prev => [...prev, {
      sender: 'assistant',
      text: response.data.respuesta
    }]);
  } catch (error) {
    console.error('Error al comunicarse con Ollama:', error);
    setTimeout(() => {
    setAiMessages(prev => [...prev, {
      sender: 'assistant',
      text: response.data.respuesta
    }]);
  setAiLoading(false);
}, 3000);

  } finally {
    setAiLoading(false);
  }
};


  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Bienvenido, {nombre}</h1>
          <p className="dashboard-subtitle">Explora nuestros productos</p>
        </div>
        <button onClick={handleCerrarSesion} className="logout-button">
          Cerrar Sesión
        </button>
      </header>

      <div className="dashboard-content">
        <section className="products-section">
          <h2 className="section-title">Productos Disponibles</h2>
          {loading ? (
            <div className="loading">Cargando productos...</div>
          ) : productos.length === 0 ? (
            <p className="empty-message">No hay productos disponibles.</p>
          ) : (
            <div className="product-grid">
              {productos.map((producto) => (
                <div key={producto._id} className="product-card">
                  <div className="product-image">
                    {producto.imagen ? (
                      <img src={producto.imagen} alt={producto.nombre} className="product-img" />
                    ) : (
                      <div className="image-placeholder">🛒</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{producto.nombre}</h3>
                    <p className="product-description">{producto.descripcion}</p>
                    <div className="price-stock">
                      <span className="price">${producto.precio.toFixed(2)}</span>
                      <span className={producto.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                        {producto.stock > 0 ? `${producto.stock} disponibles` : 'Agotado'}
                      </span>
                    </div>
                    <button
                      disabled={producto.stock <= 0}
                      onClick={() => agregarAlCarrito(producto)}
                      className={producto.stock > 0 ? 'add-button' : 'disabled-button'}
                    >
                      {producto.stock > 0 ? 'Añadir al carrito' : 'Agotado'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="cart-section">
          <h2 className="section-title">Tu Carrito</h2>
          {carrito.length === 0 ? (
            <div className="empty-cart">
              <p className="empty-message">Tu carrito está vacío</p>
              <p className="empty-submessage">Añade productos para continuar</p>
            </div>
          ) : (
            <>
              <ul className="cart-list">
                {carrito.map((item) => (
                  <li key={item._id} className="cart-item">
                    <div className="cart-item-info">
                      <h4 className="cart-item-name">{item.nombre}</h4>
                      <p className="cart-item-price">${item.precio.toFixed(2)} c/u</p>
                    </div>
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button
                          onClick={() => disminuirCantidad(item._id)}
                          className="quantity-button"
                          disabled={item.cantidad <= 1}
                        >
                          -
                        </button>
                        <span className="quantity">{item.cantidad}</span>
                        <button
                          onClick={() => aumentarCantidad(item._id)}
                          className="quantity-button"
                          disabled={item.cantidad >= item.stock}
                        >
                          +
                        </button>
                      </div>
                      <p className="item-total">
                        ${(item.precio * item.cantidad).toFixed(2)}
                      </p>
                      <button
                        onClick={() => quitarDelCarrito(item._id)}
                        className="remove-button"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="cart-summary">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>${carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Envío:</span>
                  <span>$0.00</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total:</span>
                  <span>${carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)}</span>
                </div>
                
                <button
                  onClick={finalizarCompra}
                  className="checkout-button"
                >
                  Finalizar Compra
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* Asistente de IA */}
      <button 
        onClick={toggleAiAssistant}
        className="ai-button"
      >
        {aiAssistantOpen ? '×' : 'Asistente IA'}
      </button>

      {aiAssistantOpen && (
        <div className="ai-panel">
          <div className="ai-header">
            <h3 className="ai-title">Asistente de Compras</h3>
            <button 
              onClick={toggleAiAssistant}
              className="ai-close-button"
            >
              ×
            </button>
          </div>
          
          <div className="ai-messages-container">
            {aiMessages.map((message, index) => (
              <div 
                key={index} 
                className={`ai-message ${message.sender === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                {message.text}
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
              placeholder="Escribe tu pregunta..."
              className="ai-input"
              disabled={aiLoading}
            />
            <button 
              type="submit"
              className="ai-submit-button"
              disabled={aiLoading || !userInput.trim()}
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default DashboardCliente;