import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Asegúrate de importar el archivo CSS

export default function Login() {
  // Estados para guardar lo que el usuario escribe
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

  // Función que se ejecutará al presionar "Iniciar Sesión"
        const manejarLogin = (e) => {
    e.preventDefault();

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!regexCorreo.test(correo)) {
        alert("Por favor, ingresa un correo electrónico válido.");
        return;
    }

    if (!regexPassword.test(password)) {
        alert("La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número.");
        return;
    }
    
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
    })
    .then(respuesta => {
        if (!respuesta.ok) {
            return respuesta.json().then(err => { throw new Error(err.error || "Error en el servidor") });
        }
        return respuesta.json();
    })
    .then(datos => {
        if (datos.token) {
            localStorage.setItem('token', datos.token);
            alert("¡Bienvenido al sistema!");
            navigate('/home');
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert(error.message);
    });
};

    return (
        <div className="login-wrapper">
        <div className="login-container">
            
            {/* Columna Izquierda: Formulario */}
            <div className="form-side">
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
        </div>
        </div>
    );
}