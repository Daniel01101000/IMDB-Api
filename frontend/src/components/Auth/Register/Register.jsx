import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import logo from "../../../assets/IMDB_Logo.png";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 8) {
      setMessage("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    // Validación caracteres seguros
    const safePasswordRegex = /^[A-Za-z0-9@._-]+$/;
    if (!safePasswordRegex.test(password)) {
      setMessage(
        "La contraseña solo puede contener letras, números y los símbolos: @ . _ -"
      );
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error en el servidor");
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h1>Crear cuenta</h1>
        <img src={logo} alt="IMDb Logo" className="register-logo" />

        <form onSubmit={handleRegister}>
          <label>Tu nombre</label>
          <input
            type="text"
            placeholder="Nombre completo"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Al menos 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Repite contraseña</label>
          <input
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Crear tu cuenta</button>
        </form>

        {message && <p className="message">{message}</p>}

        <div className="login-link">
          ¿Ya tienes cuenta?{" "}
          <a href="/login">Inicia sesión aquí</a>
        </div>
      </div>
    </div>
  );
}