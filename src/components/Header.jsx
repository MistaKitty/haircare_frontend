import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button, Select } from "antd";
import {
  LoginOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import logo from "../assets/logo.ico";
import translations from "../data/translations.json";
import countries from "../data/countries.json";
import CountryFlag from "react-country-flag";
import "./Header.css";
import useLanguage from "../hooks/useLanguage";

const { Option } = Select;

const Header = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("token") !== null;
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "PT"
  );
  // const { language, changeLanguage } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
    localStorage.setItem("language", value);
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  return (
    <header className="Header">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <Link
            className="navbar-brand d-flex align-items-center"
            to="/"
            style={{ width: "150px" }}
          >
            <img
              src={logo}
              alt="Logo"
              height="40"
              className="d-inline-block align-text-top"
            />
            <div className="ms-2">Hair Care</div>
          </Link>
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

          <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                  to="/"
                >
                  {translations[language].home}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/services" ? "active" : ""
                  }`}
                  to="/services"
                >
                  {translations[language].services}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/about" ? "active" : ""
                  }`}
                  to="/about"
                >
                  {translations[language].about}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/contact" ? "active" : ""
                  }`}
                  to="/contact"
                >
                  {translations[language].contact}
                </Link>
              </li>
            </ul>

            <div className="d-flex flex-column align-items-end justify-content-center">
              <div className="mb-2">
                <Select
                  placeholder="Select Language"
                  value={language}
                  onChange={handleLanguageChange}
                  className="language-select"
                  style={{ width: 120 }}
                >
                  {countries.map((country) => (
                    <Option key={country.code} value={country.code}>
                      <span className="country-flag">
                        <CountryFlag
                          countryCode={country.code}
                          svg
                          style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "8px",
                          }}
                        />
                        {country.code.toUpperCase()}
                      </span>
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="d-flex">
                {isLoggedIn ? (
                  <>
                    <Button
                      type="default"
                      icon={<ShoppingCartOutlined />}
                      className="btn-outline-light me-2"
                      style={{ minWidth: "100px" }}
                    >
                      {translations[language].cart}
                    </Button>
                    <Button
                      type="default"
                      icon={<LogoutOutlined />}
                      onClick={handleLogout}
                      className="btn-outline-light"
                      style={{ minWidth: "100px" }}
                    >
                      {translations[language].logout}
                    </Button>
                  </>
                ) : (
                  <Link to="/login" className="w-100 text-center">
                    <Button
                      type="default"
                      icon={<LoginOutlined />}
                      className="btn-outline-light"
                      style={{ minWidth: "100px" }}
                    >
                      {translations[language].login}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
