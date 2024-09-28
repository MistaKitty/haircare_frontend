import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input, Button, Spin, Typography, Alert, Space } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import Cookies from "js-cookie";

const { Title } = Typography;

const isRemote = import.meta.env.VITE_APP_USE_REMOTE === "true";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [translations, setTranslations] = useState({});

  const navigate = useNavigate();
  const language = Cookies.get("language") || "PT";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const apiUrl = isRemote
      ? `${import.meta.env.VITE_API_URL_REMOTE}/api/auth/login`
      : `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`;

    try {
      const response = await axios.post(apiUrl, { email, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        setError(translations.noTokenReceived);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || translations.loginFailed);
      } else {
        setError(translations.unexpectedError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="container">
      {!loading ? (
        <Title level={2} className="text-center text-white">
          {translations.login}
        </Title>
      ) : (
        <div className="text-center">
          <Spin size="large" className="my-4" />
          <Typography.Text className="d-block italic text-white">
            {translations.loggingIn}
          </Typography.Text>
        </div>
      )}
      {error && (
        <Alert message={error} type="error" showIcon className="mb-3" />
      )}
      <form onSubmit={handleSubmit} className="login-form">
        {!loading && (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Input
              type="email"
              placeholder={translations.emailPlaceholder}
              size="large"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input.Password
              placeholder={translations.passwordPlaceholder}
              size="large"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-center">
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="flex-1 me-2"
                >
                  {translations.login}
                </Button>
                <Button
                  type="default"
                  size="large"
                  className="flex-1"
                  onClick={handleRegister}
                >
                  {translations.register}
                </Button>
              </Space>
            </div>
          </Space>
        )}
      </form>
    </div>
  );
};

export default Login;
