import React from "react";
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
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
              {!isLoggedIn ? (
                <Link to="/login" className="me-2">
                  <Button
                    type="default"
                    icon={<LoginOutlined />}
                    className="btn-outline-light"
                  >
                    Login
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    type="default"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    className="btn-outline-light me-2"
                  >
                    Logout
                  </Button>
                  <Button
                    type="default"
                    icon={<ShoppingCartOutlined />}
                    className="btn-outline-light"
                  >
                    Cart
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
