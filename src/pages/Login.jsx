import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input, Button, Spin, Typography, Alert, Space } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

const { Title } = Typography;

const isRemote = import.meta.env.VITE_APP_USE_REMOTE === "true";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const apiUrl = isRemote
      ? import.meta.env.VITE_API_URL_REMOTE + "/api/auth/login"
      : import.meta.env.VITE_BACKEND_URL + "/api/auth/login";

    try {
      const response = await axios.post(apiUrl, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        setError("Login failed: No token received");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Login failed");
      } else {
        setError("Login failed: Unexpected error");
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
      <Title level={2} style={{ textAlign: "center", color: "white" }}>
        Login
      </Title>
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <form onSubmit={handleSubmit} className="login-form">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            type="email"
            placeholder="Email"
            size="large"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input.Password
            placeholder="Password"
            size="large"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="text-center">
            {loading ? (
              <Spin size="large" />
            ) : (
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{ flex: 1, marginRight: "10px" }}
                >
                  Login
                </Button>
                <Button
                  type="default"
                  size="large"
                  onClick={handleRegister}
                  style={{ flex: 1 }}
                >
                  Registar
                </Button>
              </Space>
            )}
          </div>
        </Space>
      </form>
    </div>
  );
};

export default Login;
