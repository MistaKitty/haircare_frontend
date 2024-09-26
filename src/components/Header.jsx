import React from "react";
import { useLocation, Link } from "react-router-dom";
import logo from "../assets/logo.ico";
import "./Header.css";

const Header = () => {
  const location = useLocation();

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
            <div className="mt-1">Hair Care</div>
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
                <Link
                  className={`nav-link text-white ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link text-white ${
                    location.pathname === "/services" ? "active" : ""
                  }`}
                  to="/services"
                >
                  Services
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link text-white ${
                    location.pathname === "/about" ? "active" : ""
                  }`}
                  to="/about"
                >
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link text-white ${
                    location.pathname === "/contact" ? "active" : ""
                  }`}
                  to="/contact"
                >
                  Contact
                </Link>
              </li>
            </ul>

            <div className="d-flex ms-auto">
              <Link
                to="/login"
                className="btn btn-outline-light me-2"
                type="button"
              >
                <i className="bi bi-person"></i>
              </Link>
              <button className="btn btn-outline-light" type="button">
                <i className="bi bi-cart"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
