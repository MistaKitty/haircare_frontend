import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input, Button, Spin } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

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
      ? import.meta.env.VITE_API_URL_REMOTE
      : import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
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

  return (
    <div className="container">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <Input
            type="email"
            id="email"
            size="large"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="custom-input"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <Input.Password
            id="password"
            size="large"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="custom-input"
          />
        </div>
        <div className="text-center">
          {loading ? (
            <Spin size="large" />
          ) : (
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="custom-button"
            >
              Login
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
