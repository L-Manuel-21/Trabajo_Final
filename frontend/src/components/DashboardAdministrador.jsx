import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Inicio from './sidebar/Inicio';
import Ventas from './sidebar/Ventas';
import Productos from './sidebar/Productos';
import Clientes from './sidebar/Clientes';

const apartados = {
  Inicio,
  Ventas,
  Productos,
  Clientes,
};

export default function DashboardAdministrador() {
  const [activo, setActivo] = useState('Inicio');
  const ComponenteActivo = apartados[activo];
  const navigate = useNavigate();

  useEffect(() => {
    const correoUsuario = localStorage.getItem('correoUsuario');
    const esAdmin = localStorage.getItem('esAdmin'); // O el campo que uses para marcar admin

    if (!correoUsuario || esAdmin !== 'true') {
      // Usuario no autenticado o no admin, redirige al login
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleCerrarSesion = () => {
    // Limpia todos los datos de sesión/localStorage
    localStorage.clear();

    // Navega al login y reemplaza historial para que no se pueda volver atrás
    navigate('/', { replace: true });
  };

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#f5f7fa',
    },
    sidebar: {
      width: '260px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e0e0e0',
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '4px 0 12px rgba(0, 0, 0, 0.05)',
    },
    sidebarTitle: {
      fontSize: '22px',
      fontWeight: 700,
      color: '#1e293b',
      marginBottom: '36px',
      textAlign: 'center',
    },
    menuList: {
      listStyleType: 'none',
      padding: 0,
      margin: 0,
    },
    menuButton: (isActive) => ({
      width: '100%',
      padding: '12px 18px',
      marginBottom: '10px',
      textAlign: 'left',
      border: 'none',
      backgroundColor: isActive ? '#2563eb' : '#f9fafb',
      color: isActive ? '#ffffff' : '#1e293b',
      fontWeight: isActive ? '600' : '500',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '15px',
      transition: 'all 0.2s ease-in-out',
      boxShadow: isActive ? '0 2px 6px rgba(0, 0, 0, 0.1)' : 'none',
    }),
    logoutButton: {
      width: '100%',
      padding: '12px 18px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: 600,
      transition: 'background-color 0.2s ease',
    },
    mainContent: {
      flexGrow: 1,
      padding: '40px',
      overflowY: 'auto',
      backgroundColor: '#f9fafb',
    },
  };


  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <nav style={styles.sidebar}>
        <div>
          <h2 style={styles.sidebarTitle}>Admin</h2>
          <h2 style={styles.sidebarTitle}>RUC: 20609784501</h2>
          <ul style={styles.menuList}>
            {Object.keys(apartados).map((item) => (
              <li key={item}>
                <button
                  style={styles.menuButton(activo === item)}
                  onClick={() => setActivo(item)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <button
            style={styles.logoutButton}
            onClick={handleCerrarSesion}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#c0392b')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#e74c3c')}
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main style={styles.mainContent}>
        <ComponenteActivo />
      </main>
    </div>
  );
}