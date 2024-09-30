import React, { useState, useEffect } from "react";
import { Input, Button, Typography, Alert, Space, Select, Spin } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CountryFlag from "react-country-flag";
import countries from "../data/countries.json";
import useLanguage from "../hooks/useLanguage";
import "./Register.css";

const { Title } = Typography;
const { Option } = Select;

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phonePrefix: "351", // Portugal prefix default
    phoneNumber: "",
    country: "",
  });

  const { language } = useLanguage();
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

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
    setSuccess(false);

    const apiUrl = import.meta.env.VITE_API_URL_REMOTE + "/api/user";

    try {
      const response = await axios.post(apiUrl, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phonePrefix: formData.phonePrefix.replace("+", ""),
        phoneNumber: formData.phoneNumber,
      });

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(response.data.message || translations.registrationFailed);
      }
    } catch (err) {
      console.error(err); // Adicionando console.error para melhor debug
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(translations.unexpectedError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      {success ? (
        <Alert
          message={
            translations.registrationSuccess ||
            "Registration successful! Redirecting to login..."
          }
          type="success"
          showIcon
          className="success-alert"
        />
      ) : (
        <>
          {!loading && (
            <Title level={2} className="title text-white">
              {translations.register || "Register"}
            </Title>
          )}
          {loading ? (
            <div className="loading-container">
              <Spin size="large" className="loading-spinner" />
              <Typography.Text className="loading-text">
                {translations.loggingIn || "Registering... Please wait..."}
              </Typography.Text>
            </div>
          ) : (
            <>
              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  className="error-alert"
                />
              )}
              <form onSubmit={handleSubmit}>
                <Space direction="vertical" className="form-space">
                  <Input
                    placeholder={translations.namePlaceholder || "Name"}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    type="email"
                    placeholder={translations.emailPlaceholder || "Email"}
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <Input.Password
                    placeholder={translations.passwordPlaceholder || "Password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="phone-container">
                    <Select
                      placeholder={
                        translations.phonePrefixPlaceholder ||
                        "Select Phone Prefix"
                      }
                      value={formData.phonePrefix}
                      onChange={(value) =>
                        setFormData({ ...formData, phonePrefix: value })
                      }
                      required
                      className="phone-select"
                    >
                      {countries.map((country) => (
                        <Option key={country.code} value={country.prefix}>
                          <span className="country-flag">
                            <CountryFlag
                              countryCode={country.code}
                              svg
                              className="country-flag-icon"
                            />
                            {country.code.toUpperCase()} (+{country.prefix}){" "}
                          </span>
                        </Option>
                      ))}
                    </Select>
                    <Input
                      placeholder={
                        translations.phoneNumberPlaceholder || "Phone Number"
                      }
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="submit-btn"
                  >
                    {translations.register || "Register"}
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
