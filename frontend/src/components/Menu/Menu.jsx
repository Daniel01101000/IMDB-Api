import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Menu.css";

export default function Menu() {
  const [open, setOpen] = useState(false);

  // Función para cerrar el menú
  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <div className="menu-hamburguesa">
      <button
        className="hamburger-btn"
        onClick={() => setOpen(!open)}
      >
        <i className="bi bi-list" style={{ fontSize: "2.5rem", color: "white" }}></i>
      </button>

      {open && (
        <nav className="menu-dropdown">
          <Link to="/" onClick={handleLinkClick}>Inicio</Link>
          <Link to="/celebridades" onClick={handleLinkClick}>Celebridades</Link>
          <Link to="/top-rated" onClick={handleLinkClick}>Top Rated</Link>
          <Link to="/favoritos" onClick={handleLinkClick}>Favoritos</Link>
        </nav>
      )}
    </div>
  );
}