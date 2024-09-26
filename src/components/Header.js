import React from "react";
import logo from "../assets/logo.ico";

const Header = () => {
  return (
    <header className="Header bg-black text-white">
      <nav className="navbar navbar-expand-lg navbar-dark bg-black">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img
              src={logo}
              alt="Logo"
              height="40"
              className="d-inline-block align-text-top"
            />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link text-white" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/services">
                  Services
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/about">
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/contact">
                  Contact
                </a>
              </li>
            </ul>

            {/* Botões de perfil e carrinho à direita */}
            <div className="d-flex ms-auto">
              <button className="btn btn-outline-light me-2" type="button">
                <i className="bi bi-person"></i> {/* Icone do perfil */}
              </button>
              <button className="btn btn-outline-light" type="button">
                <i className="bi bi-cart"></i> {/* Icone do carrinho */}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
