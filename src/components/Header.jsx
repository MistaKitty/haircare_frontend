import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "antd";
import {
  LoginOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import logo from "../assets/logo.ico";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("token") !== null;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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
            onClick={toggleMenu}
            aria-controls="navbarNav"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
            id="navbarNav"
          >
            <ul className="navbar-nav mx-auto">
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

            <div className="d-flex align-items-center">
              {isLoggedIn ? (
                <>
                  <Button
                    type="default"
                    icon={<ShoppingCartOutlined />}
                    className="btn-outline-light me-2"
                  >
                    Cart
                  </Button>
                  <Button
                    type="default"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    className="btn-outline-light"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login" className="w-100 text-center">
                  <Button
                    type="default"
                    icon={<LoginOutlined />}
                    className="btn-outline-light"
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
