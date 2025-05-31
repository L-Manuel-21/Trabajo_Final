import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Clientes() {
  const [usuarios, setUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formEditar, setFormEditar] = useState({ nombre: '', correo: '', telefono: '' });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const mostrarMensaje = (texto, tipo = 'info') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 3000);
  };

  const obtenerUsuarios = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/usuarios');
      setUsuarios(data);
    } catch (error) {
      mostrarMensaje('Error al obtener usuarios', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este usuario?')) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/usuarios/${id}`);
      mostrarMensaje('Usuario eliminado correctamente', 'success');
      await obtenerUsuarios();
    } catch (error) {
      mostrarMensaje('Error al eliminar usuario', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicion = (usuario) => {
    setEditandoId(usuario._id);
    setFormEditar({ nombre: usuario.nombre, correo: usuario.correo, telefono: usuario.telefono });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormEditar({ nombre: '', correo: '', telefono: '' });
  };

  const guardarEdicion = async (id) => {
    if (!formEditar.nombre.trim() || !formEditar.correo.trim()) {
      mostrarMensaje('Nombre y correo son obligatorios', 'error');
      return;
    }
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/usuarios/${id}`, formEditar);
      mostrarMensaje('Usuario actualizado correctamente', 'success');
      setEditandoId(null);
      await obtenerUsuarios();
    } catch (error) {
      mostrarMensaje('Error al actualizar usuario', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEditar(prev => ({ ...prev, [name]: value }));
  };

  const styles = {
    container: {
      maxWidth: 900,
      margin: '40px auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f9fafb',
      padding: 30,
      borderRadius: 8,
      boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    },
    heading: {
      fontSize: 28,
      fontWeight: 700,
      marginBottom: 24,
      color: '#34495e',
      textAlign: 'center',
    },
    mensaje: {
      marginBottom: 20,
      padding: 12,
      borderRadius: 6,
      textAlign: 'center',
      color: '#fff',
      backgroundColor: mensaje?.tipo === 'error' ? '#e74c3c' :
                      mensaje?.tipo === 'success' ? '#2ecc71' : '#3498db',
      fontWeight: '600',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0 14px',
    },
    th: {
      backgroundColor: '#34495e',
      color: '#fff',
      padding: '14px 18px',
      textAlign: 'left',
      borderRadius: '10px 10px 0 0',
      userSelect: 'none',
    },
    td: {
      padding: '14px 18px',
      backgroundColor: '#fff',
      borderRadius: 10,
      fontSize: 16,
      color: '#2c3e50',
      verticalAlign: 'middle',
      boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
    },
    input: {
      padding: '8px 14px',
      width: '100%',
      border: '1.5px solid #dcdcdc',
      borderRadius: 8,
      outline: 'none',
      fontSize: 15,
      transition: 'border-color 0.25s',
    },
    inputFocus: {
      borderColor: '#3498db',
    },
    button: {
      marginRight: 8,
      padding: '8px 16px',
      border: 'none',
      borderRadius: 8,
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: 14,
      transition: 'background-color 0.3s ease',
      userSelect: 'none',
      disabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
      }
    },
    editar: {
      backgroundColor: '#f39c12',
      color: '#fff',
    },
    eliminar: {
      backgroundColor: '#e74c3c',
      color: '#fff',
    },
    guardar: {
      backgroundColor: '#27ae60',
      color: '#fff',
    },
    cancelar: {
      backgroundColor: '#95a5a6',
      color: '#fff',
    },
    spinner: {
      display: 'inline-block',
      width: 18,
      height: 18,
      border: '3px solid #f3f3f3',
      borderTop: '3px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      verticalAlign: 'middle',
      marginLeft: 8,
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Clientes Registrados</h3>
      {mensaje && <div role="alert" style={styles.mensaje}>{mensaje.texto}</div>}

      {loading && usuarios.length === 0 ? (
        <p>Cargando clientes...</p>
      ) : usuarios.length === 0 ? (
        <p>No hay clientes registrados.</p>
      ) : (
        <table style={styles.table} aria-label="Lista de clientes">
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Correo</th>
              <th style={styles.th}>Teléfono</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(({ _id, nombre, correo, telefono }) => (
              <tr key={_id}>
                <td style={styles.td}>
                  {editandoId === _id ? (
                    <input
                      type="text"
                      name="nombre"
                      value={formEditar.nombre}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder="Nombre"
                      autoFocus
                      aria-label="Nombre"
                    />
                  ) : (
                    nombre
                  )}
                </td>
                <td style={styles.td}>
                  {editandoId === _id ? (
                    <input
                      type="email"
                      name="correo"
                      value={formEditar.correo}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder="Correo"
                      aria-label="Correo"
                    />
                  ) : (
                    correo
                  )}
                </td>
                <td style={styles.td}>
                  {editandoId === _id ? (
                    <input
                      type="tel"
                      name="telefono"
                      value={formEditar.telefono}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder="Teléfono"
                      aria-label="Teléfono"
                    />
                  ) : (
                    telefono || '—'
                  )}
                </td>
                <td style={styles.td}>
                  {editandoId === _id ? (
                    <>
                      <button
                        type="button"
                        style={{ ...styles.button, ...styles.guardar }}
                        onClick={() => guardarEdicion(_id)}
                        disabled={loading}
                        aria-label="Guardar cambios"
                      >
                        Guardar
                        {loading && <span style={styles.spinner} aria-hidden="true"></span>}
                      </button>
                      <button
                        type="button"
                        style={{ ...styles.button, ...styles.cancelar }}
                        onClick={cancelarEdicion}
                        disabled={loading}
                        aria-label="Cancelar edición"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        style={{ ...styles.button, ...styles.editar }}
                        onClick={() => iniciarEdicion({ _id, nombre, correo, telefono })}
                        disabled={loading}
                        aria-label={`Editar usuario ${nombre}`}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        style={{ ...styles.button, ...styles.eliminar }}
                        onClick={() => eliminarUsuario(_id)}
                        disabled={loading}
                        aria-label={`Eliminar usuario ${nombre}`}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
