import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button, Select, Badge } from "antd";
import {
  LoginOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import logo from "../assets/logo.ico";
import CountryFlag from "react-country-flag";
import "./Header.css";
import languagesData from "../data/languages.json";
import useLanguage from "../hooks/useLanguage";
import axios from "axios";

const { Option } = Select;

const Header = () => {
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [translations, setTranslations] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [totalItemsInCart, setTotalItemsInCart] = useState(0);
  const pollingInterval = 500;

  const { language, changeLanguage } = useLanguage();

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

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL_REMOTE}/api/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const total = response.data.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setTotalItemsInCart(total);
    } catch (error) {
      console.error("Erro ao obter os itens do carrinho:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartItems();
      const intervalId = setInterval(fetchCartItems, pollingInterval);
      return () => clearInterval(intervalId);
      setTotalItemsInCart(0);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLanguageChange = (value) => {
    changeLanguage(value);
    window.location.reload();
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
              {isLoggedIn && (
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname === "/appointments" ? "active" : ""
                    }`}
                    to="/appointments"
                  >
                    {translations.appointments || "Appointments"}
                  </Link>
                </li>
              )}
            </ul>

            <div
              className={`d-flex ${
                isMobile
                  ? "flex-column align-items-center"
                  : "flex-column align-items-center"
              }`}
            >
              <Select
                placeholder="Select Language"
                value={language}
                onChange={handleLanguageChange}
                className="language-select mb-3"
                style={{ width: 100 }}
              >
                {languagesData.map(({ code }) => (
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

              <div
                className={`d-flex ${
                  isMobile ? "justify-content-around" : "align-items-center"
                }`}
              >
                {isLoggedIn ? (
                  <>
                    <Link to="/checkout" className="d-flex align-items-center">
                      <Badge
                        count={totalItemsInCart}
                        style={{ marginRight: 8 }}
                      >
                        <Button
                          type="default"
                          icon={<ShoppingCartOutlined />}
                          className="btn-outline-light"
                          style={{ minWidth: "100px" }}
                        >
                          {translations.cart || "Cart"}
                        </Button>
                      </Badge>
                    </Link>
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
                {!isLoggedIn && menuOpen && isMobile && (
                  <Link to="/register" className="w-100 text-center">
                    <Button
                      type="default"
                      className="btn-outline-light ms-2"
                      style={{ minWidth: "100px" }}
                    >
                      {translations.register || "Register"}
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
