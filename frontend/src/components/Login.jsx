import React, { useState } from 'react';
import './Login.css'; // Asegúrate de importar el archivo CSS

export default function Login() {
  // Estados para guardar lo que el usuario escribe
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');

  // Función que se ejecutará al presionar "Iniciar Sesión"
        const manejarLogin = (e) => {
        e.preventDefault();
        console.log("Intentando iniciar sesión con:", correo, password);
        // Aquí es donde pondrás tu código fetch() hacia tu backend (localhost:3000/api/login)
    };

    return (
        <div className="login-wrapper">
        <div className="login-container">
            
            {/* Columna Izquierda: Formulario */}
            <div className="form-side">
            <div className="logo">
                <img 
                src="https://via.placeholder.com/80x80/FFFFFF/2b6e82?text=Healy+Logo" 
                alt="Logotipo de Healy" 
                />
            </div>
            
            <h1>¡Bienvenido de vuelta!</h1>
            <p className="subtitle">Ingresa tus datos</p>
            
            <form onSubmit={manejarLogin}>
                <div className="form-group">
                <label htmlFor="correo">Correo</label>
                <input 
                    type="email" 
                    id="correo" 
                    placeholder="correo@ejemplo.com" 
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required 
                />
                </div>
                
                <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input 
                    type="password" 
                    id="password" 
                    placeholder="Ingresa tu contraseña" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
                </div>
                
                <button type="submit">Iniciar Sesión</button>
            </form>
            
            <div className="register-link">
                ¿No tienes cuenta? <a href="#">Regístrate</a>
            </div>
            </div>
            
            {/* Columna Derecha: Imagen de Fondo */}
            <div className="image-side">
                {/* La imagen se maneja desde el CSS */}
            </div>
            
        </div>
        </div>
    );
}