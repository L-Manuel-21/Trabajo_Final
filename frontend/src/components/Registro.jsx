import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Registro.css';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);
  const [secondaryButtonHover, setSecondaryButtonHover] = useState(false);
  const navigate = useNavigate();

  // Efecto para animación del título
  useEffect(() => {
    const titleElement = document.getElementById('registro-title');
    if (titleElement) {
      titleElement.classList.add('title-animation');
    }
  }, []);

  const handleRegistro = async () => {
    setError('');
    
    if (!nombre || !correo || !telefono || !contrasena || !confirmarContrasena) {
      setError('Por favor complete todos los campos');
      return;
    }
    
    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    
    try {
      await axios.post('http://localhost:5000/api/usuarios/registro', {
        nombre,
        correo,
        telefono,
        contrasena,
      });

      alert('Registro exitoso. Por favor inicie sesión.');
      navigate('/');
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const volverAlLogin = () => {
    navigate('/');
  };

  return (
    <div className="registro-container">
      <h2 id="registro-title" className="registro-title">Crear una cuenta</h2>
      
      {error && <div className="registro-error">{error}</div>}
      
      <div className="registro-form-group">
        <label className="registro-label">Nombre completo</label>
        <input 
          type="text" 
          value={nombre} 
          onChange={e => setNombre(e.target.value)} 
          placeholder="Ingrese su nombre completo" 
          className="registro-input"
        />
      </div>
      
      <div className="registro-form-group">
        <label className="registro-label">Correo electrónico</label>
        <input 
          type="email" 
          value={correo} 
          onChange={e => setCorreo(e.target.value)} 
          placeholder="ejemplo@correo.com" 
          className="registro-input"
        />
      </div>
      
      <div className="registro-form-group">
        <label className="registro-label">Teléfono</label>
        <input 
          type="tel" 
          value={telefono} 
          onChange={e => setTelefono(e.target.value)} 
          placeholder="Número de teléfono" 
          className="registro-input"
        />
      </div>
      
      <div className="registro-form-group">
        <label className="registro-label">Contraseña</label>
        <input 
          type="password" 
          value={contrasena} 
          onChange={e => setContrasena(e.target.value)} 
          placeholder="Mínimo 6 caracteres" 
          className="registro-input"
        />
      </div>
      
      <div className="registro-form-group">
        <label className="registro-label">Confirmar contraseña</label>
        <input 
          type="password" 
          value={confirmarContrasena} 
          onChange={e => setConfirmarContrasena(e.target.value)} 
          placeholder="Confirme su contraseña" 
          className="registro-input"
        />
      </div>
      
      <button 
        onClick={handleRegistro} 
        className={`registro-button ${buttonHover ? 'registro-primary-button-hover' : 'registro-primary-button'}`}
        disabled={isLoading}
        onMouseEnter={() => setButtonHover(true)}
        onMouseLeave={() => setButtonHover(false)}
      >
        {isLoading ? 'Registrando...' : 'Registrarse'}
      </button>
      
      <button 
        onClick={volverAlLogin} 
        className={`registro-button ${secondaryButtonHover ? 'registro-secondary-button-hover' : 'registro-secondary-button'}`}
        onMouseEnter={() => setSecondaryButtonHover(true)}
        onMouseLeave={() => setSecondaryButtonHover(false)}
      >
        Volver al inicio de sesión
      </button>
      
      <div className="registro-link">
        ¿Ya tienes una cuenta?{' '}
        <span className="registro-link-text" onClick={volverAlLogin}>
          Inicia sesión aquí
        </span>
      </div>
    </div>
  );
}

export default Registro;