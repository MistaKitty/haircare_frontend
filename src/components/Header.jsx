import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button, Select } from "antd";
import {
  LoginOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import logo from "../assets/logo.ico";
import Cookies from "js-cookie";
import CountryFlag from "react-country-flag";
import "./Header.css";
import countriesData from "../data/countries.json";

const { Option } = Select;

const Header = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("token") !== null;
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "PT"
  );
  const [translations, setTranslations] = useState({});
  const [countries, setCountries] = useState({});

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translationModule = await import(
          `../data/translations/${language}.json`
        );
        setTranslations(translationModule);
      } catch (err) {
        console.error("Error loading translations:", err);
        setTranslations({});
      }
    };

    loadTranslations();
  }, [language]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        // Aceder diretamente aos dados de países importados
        setCountries(countriesData);
      } catch (err) {
        console.error("Error loading countries:", err);
        setCountries({});
      }
    };

    loadCountries();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLanguageChange = (value) => {
    Cookies.remove("language");
    setLanguage(value);
    localStorage.setItem("language", value);
    Cookies.set("language", value, { expires: 365 });
    window.location.reload();
  };

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
              {["/", "/services", "/about", "/contact"].map((path, index) => (
                <li className="nav-item" key={index}>
                  <Link
                    className={`nav-link ${
                      location.pathname === path ? "active" : ""
                    }`}
                    to={path}
                  >
                    {path === "/"
                      ? translations.home || "Home"
                      : translations[path.replace("/", "")] ||
                        path.replace("/", "").charAt(0).toUpperCase() +
                          path.slice(2)}
                  </Link>
                </li>
              ))}
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
                  {Object.values(countries).map(({ code }) => (
                    <Option key={code} value={code}>
                      <span className="country-flag">
                        <CountryFlag
                          countryCode={code}
                          svg
                          style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "8px",
                          }}
                        />
                        {code}
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
                      {translations.cart || "Cart"}
                    </Button>
                    <Button
                      type="default"
                      icon={<LogoutOutlined />}
                      onClick={handleLogout}
                      className="btn-outline-light"
                      style={{ minWidth: "100px" }}
                    >
                      {translations.logout || "Logout"}
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
                      {translations.login || "Login"}
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
