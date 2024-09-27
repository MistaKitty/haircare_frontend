import React, { useState } from "react";
import { Input, Button, Typography, Alert, Space, Select, Spin } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CountryFlag from "react-country-flag";
import countries from "../data/countries.json";

const { Title } = Typography;
const { Option } = Select;

const isRemote = import.meta.env.VITE_APP_USE_REMOTE === "true";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const apiUrl = isRemote
      ? import.meta.env.VITE_API_URL_REMOTE + "/api/user"
      : import.meta.env.VITE_BACKEND_URL + "/api/user";

    try {
      console.log("Request Body:", {
        name,
        email,
        password,
        phonePrefix: phonePrefix.replace("+", ""),
        phoneNumber,
      });

      const response = await axios.post(apiUrl, {
        name,
        email,
        password,
        phonePrefix: phonePrefix.replace("+", ""),
        phoneNumber,
      });

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed: Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ textAlign: "center" }}>
      {success ? (
        <Alert
          message="Registration successful! Redirecting to login..."
          type="success"
          showIcon
          style={{
            marginBottom: 16,
            fontSize: "1.5rem", // Aumentar o tamanho da fonte
            display: "inline-block", // Centraliza melhor
          }}
        />
      ) : (
        <>
          {!loading && (
            <Title level={2} style={{ color: "white" }}>
              Register
            </Title>
          )}
          {loading ? (
            <div style={{ textAlign: "center" }}>
              <Spin size="large" style={{ marginTop: "20px" }} />
              <Typography.Text
                style={{
                  display: "block",
                  fontStyle: "italic",
                  color: "white",
                  marginTop: "10px",
                }}
              >
                Registering... Please wait...
              </Typography.Text>
            </div>
          ) : (
            <>
              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}
              <form onSubmit={handleSubmit}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input.Password
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Select
                      placeholder="Prefix"
                      value={phonePrefix}
                      onChange={setPhonePrefix}
                      required
                      style={{ width: "50%" }}
                    >
                      {countries.map((country) => (
                        <Option key={country.code} value={country.prefix}>
                          <span
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <CountryFlag
                              countryCode={country.code}
                              svg
                              style={{
                                width: "1.5em",
                                height: "1.5em",
                                marginRight: "8px",
                              }}
                            />
                            {country.code.toUpperCase()} (+{country.prefix}){" "}
                          </span>
                        </Option>
                      ))}
                    </Select>
                    <Input
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      style={{ marginLeft: "10px", width: "90%" }}
                    />
                  </div>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Register
                  </Button>
                </Space>
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Register;
