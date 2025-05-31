import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Ventas() {
  const [compras, setCompras] = useState([]);
  const [facturaIndex, setFacturaIndex] = useState(null);

  useEffect(() => {
    const obtenerCompras = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/compras');
        setCompras(res.data);
      } catch (error) {
        console.error('Error al obtener historial de compras:', error);
      }
    };

    obtenerCompras();
  }, []);

  const generarPDF = (compra) => {
    alert(`Factura para ${compra.usuario} generada.`);
  };

  return (
    <div className="ventas-container">
      <h2 className="ventas-titulo">📦 Historial de Ventas</h2>

      {compras.length === 0 ? (
        <p className="mensaje">No hay compras registradas.</p>
      ) : (
        <div className="lista-compras">
          {compras.map((compra, index) => (
            <div key={index} className="compra-wrapper">
              <div
                className="compra-card"
                onClick={() => setFacturaIndex(index)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => { if (e.key === 'Enter') setFacturaIndex(index); }}
              >
                <div className="compra-header">
                  <p><strong>Usuario:</strong> {compra.usuario}</p>
                  <p className="fecha">{new Date(compra.fecha).toLocaleString()}</p>
                </div>
                <p className="total">Total: <span>${compra.total.toFixed(2)}</span></p>
                <div className="productos-compra">
                  <p><strong>Productos:</strong></p>
                  <ul>
                    {compra.productos.map((producto, idx) => (
                      <li key={idx}>
                        🛒 {producto.nombre} <em>({producto.cantidad} x ${producto.precio.toFixed(2)})</em>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {facturaIndex === index && (
                <div
                  className="detalle-factura-overlay"
                  onClick={() => setFacturaIndex(null)}
                  aria-modal="true"
                  role="dialog"
                >
                  <div
                    className="detalle-factura"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3>🧾 Factura de Venta</h3>
                    <p><strong>Cliente:</strong> {compra.usuario}</p>
                    <p><strong>Fecha:</strong> {new Date(compra.fecha).toLocaleString()}</p>
                    <p><strong>Total:</strong> <span>${compra.total.toFixed(2)}</span></p>
                    <p><strong>Productos comprados:</strong></p>
                    <ul>
                      {compra.productos.map((producto, idx) => (
                        <li key={idx}>
                          {producto.nombre} — {producto.cantidad} × ${producto.precio.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                    <div className="factura-acciones">
                      <button
                        className="btn-primary"
                        onClick={() => generarPDF(compra)}
                        aria-label={`Descargar PDF de factura para ${compra.usuario}`}
                      >
                        📥 Descargar PDF
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => setFacturaIndex(null)}
                        aria-label="Cerrar detalle de factura"
                      >
                        ❌ Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        /* Reset básico */
        * {
          box-sizing: border-box;
        }

        .ventas-container {
          max-width: 920px;
          margin: 3rem auto 5rem;
          padding: 0 1.5rem;
          font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #1e293b;
          user-select: none;
        }

        .ventas-titulo {
          font-size: 2.8rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 2.5rem;
          color: #16a34a;
          letter-spacing: 1.8px;
          text-shadow: 0 0 8px rgba(22, 163, 74, 0.4);
        }

        .mensaje {
          text-align: center;
          font-size: 1.3rem;
          color: #64748b;
          font-weight: 600;
          margin-top: 4rem;
        }

        .lista-compras {
          max-height: 650px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding-right: 12px;
          scroll-behavior: smooth;
        }

        .lista-compras::-webkit-scrollbar {
          width: 10px;
        }
        .lista-compras::-webkit-scrollbar-track {
          background: #e0f2fe;
          border-radius: 10px;
        }
        .lista-compras::-webkit-scrollbar-thumb {
          background: #16a34a;
          border-radius: 10px;
        }

        .compra-wrapper {
          position: relative;
          border-bottom: 2px solid #d1d5db;
          padding-bottom: 16px;
        }

        .compra-card {
          background: #ffffffcc;
          border-radius: 20px;
          padding: 24px 30px;
          box-shadow:
            0 14px 30px rgba(22, 163, 74, 0.12),
            0 6px 12px rgba(22, 163, 74, 0.08);
          cursor: pointer;
          transition:
            transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.3s ease,
            background-color 0.25s ease;
          user-select: text;
        }
        .compra-card:hover,
        .compra-card:focus-visible {
          background: #dcfce7;
          transform: translateY(-6px);
          box-shadow:
            0 20px 40px rgba(22, 163, 74, 0.25),
            0 8px 20px rgba(22, 163, 74, 0.15);
          outline: none;
        }

        .compra-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .compra-header p {
          font-size: 1.2rem;
          font-weight: 600;
          color: #065f46;
        }
        .fecha {
          font-size: 0.95rem;
          font-weight: 400;
          color: #4b5563;
          font-style: italic;
        }

        .total {
          font-size: 1.2rem;
          margin: 10px 0 18px;
          font-weight: 700;
          color: #15803d;
        }
        .total span {
          background: #bbf7d0;
          padding: 4px 10px;
          border-radius: 12px;
          box-shadow: inset 0 0 6px #22c55e99;
        }

        .productos-compra p {
          font-weight: 700;
          font-size: 1.1rem;
          color: #065f46;
          margin-bottom: 6px;
          letter-spacing: 0.5px;
        }

        .productos-compra ul {
          list-style: none;
          padding-left: 0;
          max-height: 140px;
          overflow-y: auto;
          color: #374151;
          font-size: 1rem;
          border-left: 3px solid #22c55e;
          padding-left: 14px;
          user-select: text;
        }
        .productos-compra ul::-webkit-scrollbar {
          width: 6px;
        }
        .productos-compra ul::-webkit-scrollbar-thumb {
          background: #22c55e;
          border-radius: 8px;
        }

        .productos-compra li {
          margin-bottom: 8px;
          line-height: 1.35;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .productos-compra li em {
          color: #16a34a;
          font-style: normal;
          font-weight: 600;
        }

        /* Modal Factura */

        .detalle-factura-overlay {
          position: fixed;
          inset: 0;
          background: rgba(18, 52, 86, 0.85);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeInOverlay 0.3s ease forwards;
        }
        @keyframes fadeInOverlay {
          from {opacity: 0;}
          to {opacity: 1;}
        }

        .detalle-factura {
          background: #ffffff;
          border-radius: 22px;
          padding: 32px 36px;
          max-width: 480px;
          width: 90%;
          box-shadow: 0 22px 48px rgba(22, 163, 74, 0.3);
          animation: slideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          user-select: text;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .detalle-factura h3 {
          color: #15803d;
          font-size: 1.9rem;
          font-weight: 700;
          margin-bottom: 20px;
          text-align: center;
          text-shadow: 0 0 6px #22c55e77;
        }

        .detalle-factura p {
          font-size: 1.1rem;
          margin: 12px 0;
          color: #14532d;
          font-weight: 600;
        }
        .detalle-factura p span {
          font-weight: 700;
          color: #166534;
          background: #bbf7d0aa;
          padding: 3px 9px;
          border-radius: 12px;
        }

        .detalle-factura ul {
          margin-top: 14px;
          list-style: none;
          padding-left: 0;
          max-height: 200px;
          overflow-y: auto;
          border-left: 4px solid #22c55e;
          padding-left: 14px;
          font-size: 1rem;
          color: #14532d;
        }
        .detalle-factura ul::-webkit-scrollbar {
          width: 6px;
        }
        .detalle-factura ul::-webkit-scrollbar-thumb {
          background: #22c55e;
          border-radius: 8px;
        }
        .detalle-factura li {
          margin-bottom: 10px;
          line-height: 1.4;
        }

        .factura-acciones {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 28px;
        }
        .factura-acciones button {
          padding: 10px 24px;
          border-radius: 24px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          border: none;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          user-select: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #16a34a, #22c55e);
          color: white;
          box-shadow: 0 8px 20px #22c55e99;
        }
        .btn-primary:hover,
        .btn-primary:focus-visible {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          box-shadow: 0 12px 28px #16a34aaa;
          outline: none;
        }

        .btn-secondary {
          background: #ef4444;
          color: white;
          box-shadow: 0 6px 18px #ef444488;
        }
        .btn-secondary:hover,
        .btn-secondary:focus-visible {
          background: #dc2626;
          box-shadow: 0 10px 28px #dc2626cc;
          outline: none;
        }

        /* Responsive */
        @media (max-width: 600px) {
          .compra-card {
            padding: 18px 22px;
          }
          .detalle-factura {
            padding: 28px 24px;
            max-width: 95vw;
          }
          .ventas-titulo {
            font-size: 2.4rem;
          }
        }
      `}</style>
    </div>
  );
}
