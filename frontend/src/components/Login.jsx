import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');

    if (!correo || !contrasena) {
      setError('Por favor ingrese su correo y contraseña');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/usuarios/login', {
        correo,
        contrasena,
      });

      if (response.status === 200) {
        const { nombre, correo: correoUsuario, esAdmin } = response.data.usuario;

        // Guardar info en localStorage
        localStorage.setItem('nombreUsuario', nombre);
        localStorage.setItem('correoUsuario', correoUsuario);
        localStorage.setItem('esAdmin', esAdmin);  // Guardamos si es admin o no

        // Navegar según rol
        if (esAdmin) {
          navigate('/admin');
        } else {
          navigate('/cliente');
        }
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.msg || 'Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCrearUsuario = () => navigate('/registro');
  const visitarSinCuenta = () => navigate('/invitado');
  const visitarAdministrador = () => navigate('/admin');

  return (
    <div className="login-container">
      <h2 className="login-title">Iniciar Sesión</h2>

      {error && <div className="login-error">{error}</div>}

      <div className="login-form-group">
        <label className="login-label">Correo electrónico</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          className="login-input"
          autoComplete="username"
        />
      </div>

      <div className="login-form-group">
        <label className="login-label">Contraseña</label>
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          placeholder="Ingresa tu contraseña"
          className="login-input"
          autoComplete="current-password"
        />
      </div>

      <button
        onClick={handleLogin}
        className="login-primary-button"
        disabled={isLoading}
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>

      <div className="login-divider">
        <span>o</span>
      </div>

      <button
        onClick={handleCrearUsuario}
        className="login-secondary-button"
      >
        Crear una cuenta nueva
      </button>

      <button
        onClick={visitarSinCuenta}
        className="login-secondary-button login-secondary-button-bottom"
      >
        Continuar como invitado
      </button>
    </div>
  );
}

export default Login;
