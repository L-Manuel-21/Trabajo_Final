import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Inicio() {
  const [ventasHoy, setVentasHoy] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalProductos, setTotalProductos] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/dashboard/resumen');
        setVentasHoy(data.ventasHoy);
        setTotalClientes(data.totalClientes);
        setTotalProductos(data.totalProductos);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setCargando(false);
      }
    };
    fetchDatos();
  }, []);

  if (cargando)
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Cargando datos...</p>
      </div>
    );

  return (
    <div className="container">
      <header className="header">
        <h1>Panel de Administración</h1>
        <p>Resumen rápido de tu negocio</p>
      </header>

      <section className="cards">
        <div className="card ventas">
          <div className="card-icon">🛒</div>
          <div>
            <h3>Ventas Hoy</h3>
            <p className="number">{ventasHoy}</p>
          </div>
        </div>

        <div className="card clientes">
          <div className="card-icon">👥</div>
          <div>
            <h3>Clientes Registrados</h3>
            <p className="number">{totalClientes}</p>
          </div>
        </div>

        <div className="card productos">
          <div className="card-icon">📦</div>
          <div>
            <h3>Productos Totales</h3>
            <p className="number">{totalProductos}</p>
          </div>
        </div>
      </section>

      <style>{`
        /* Container */
        .container {
          max-width: 1000px;
          margin: 40px auto;
          padding: 0 20px;
          font-family: 'Poppins', sans-serif;
          color: #222;
        }
        /* Header */
        .header {
          text-align: center;
          margin-bottom: 40px;
          color: #444;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .header h1 {
          font-weight: 700;
          font-size: 2.8rem;
          margin-bottom: 8px;
          background: linear-gradient(90deg, #00b09b, #96c93d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .header p {
          font-weight: 500;
          font-size: 1.1rem;
          color: #666;
        }

        /* Cards Container */
        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(280px,1fr));
          gap: 30px;
        }

        /* Card */
        .card {
          background: #fff;
          border-radius: 20px;
          padding: 30px 25px;
          box-shadow:
            0 8px 15px rgba(0, 0, 0, 0.1),
            0 4px 6px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          gap: 20px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: default;
        }
        .card:hover {
          transform: translateY(-8px);
          box-shadow:
            0 16px 30px rgba(0, 0, 0, 0.15),
            0 8px 12px rgba(0, 0, 0, 0.1);
        }

        /* Icon */
        .card-icon {
          font-size: 48px;
          background: linear-gradient(135deg, #96c93d, #00b09b);
          color: white;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 8px 20px rgba(0, 176, 155, 0.4);
          flex-shrink: 0;
          user-select: none;
        }

        /* Different gradient colors for each card */
        .ventas .card-icon {
          background: linear-gradient(135deg, #00b09b, #96c93d);
          box-shadow: 0 8px 20px rgba(150, 201, 61, 0.5);
        }
        .clientes .card-icon {
          background: linear-gradient(135deg, #4facfe, #00f2fe);
          box-shadow: 0 8px 20px rgba(0, 242, 254, 0.5);
        }
        .productos .card-icon {
          background: linear-gradient(135deg, #f7971e, #ffd200);
          box-shadow: 0 8px 20px rgba(255, 210, 0, 0.5);
        }

        /* Text inside cards */
        h3 {
          margin: 0 0 8px;
          font-weight: 600;
          font-size: 1.3rem;
          color: #333;
        }
        .number {
          font-size: 2.6rem;
          font-weight: 800;
          color: #111;
          letter-spacing: 1px;
        }

        /* Loading Spinner */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 80px;
          color: #888;
          font-weight: 500;
          font-size: 1.2rem;
        }
        .spinner {
          width: 50px;
          height: 50px;
          border: 6px solid #ccc;
          border-top-color: #00b09b;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 12px;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Responsive tweaks */
        @media (max-width: 480px) {
          .card {
            padding: 25px 15px;
          }
          .card-icon {
            width: 60px;
            height: 60px;
            font-size: 40px;
          }
          .number {
            font-size: 2rem;
          }
          .header h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
