import React, { useState, useEffect } from "react";
import { Typography, Input, Button, Alert, Space, Select } from "antd";
import useLanguage from "../hooks/useLanguage";
import { WhatsAppOutlined } from "@ant-design/icons";
import countries from "../data/countries.json";
import CountryFlag from "react-country-flag";
import "./ContactPage.css";

const { Title, Text } = Typography;
const { Option } = Select;

const ContactPage = () => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phonePrefix: countries[0].prefix,
    phone: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrefixChange = (value) => {
    setFormData({ ...formData, phonePrefix: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setError("");
  };

  const whatsappMessage =
    translations.whatsappMessage || "Olá! Gostaria de entrar em contato.";
  const email = import.meta.env.VITE_EMAIL;
  const phoneNumber = import.meta.env.VITE_PHONE_NUMBER;
  const workingHours =
    translations.workingHours || "Horário: Seg - Sex, 9h - 18h";

  const inputWidth = 400;

  return (
    <div
      className="contact-container d-flex flex-column align-items-center justify-content-start min-vh-100"
      style={{ paddingTop: "40px" }}
    >
      <Title level={2} className="white-text text-center">
        {translations.contact || "Contacte-nos"}
      </Title>
      <Text className="white-text" style={{ marginBottom: "20px" }}>
        {translations.contactDescription ||
          "Estamos disponíveis apenas ao domicílio."}
      </Text>
      <Space direction="vertical" size="large" className="text-center">
        <Text className="white-text">
          {translations.phoneLabel || "Telefone:"}
          <a
            href={`https://wa.me/${formData.phonePrefix.replace(
              /[^0-9]/g,
              ""
            )}${formData.phone.replace(
              /[^0-9]/g,
              ""
            )}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: "8px" }}
          >
            <WhatsAppOutlined /> {phoneNumber}
          </a>
        </Text>
        <Text className="white-text" style={{ marginBottom: "20px" }}>
          {translations.emailLabel || "Email: "} {email}
        </Text>
        <Text className="white-text">{workingHours}</Text>
      </Space>
      <form onSubmit={handleSubmit} className="mx-auto">
        <Space direction="vertical" size="large" className="w-100">
          <Input
            placeholder={translations.namePlaceholder || "Nome"}
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="text-center"
            style={{ width: inputWidth }}
          />
          <Input
            type="email"
            placeholder={translations.emailPlaceholder || "Email"}
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="text-center"
            style={{ width: inputWidth }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Select
              placeholder={
                translations.phonePrefixPlaceholder || "Selecionar Prefixo"
              }
              value={formData.phonePrefix}
              onChange={handlePrefixChange}
              required
              className="phone-select"
              style={{ width: "120px" }}
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
                translations.phonePlaceholder || "Número de Telefone"
              }
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="text-center"
              style={{ width: "274px" }}
            />
          </div>
          <Input.TextArea
            placeholder={translations.messagePlaceholder || "Mensagem"}
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            style={{ width: inputWidth, height: "120px" }}
          />
          <Button
            type="primary"
            htmlType="submit"
            className="w-100"
            style={{ width: inputWidth }}
          >
            {translations.send || "Enviar"}
          </Button>
        </Space>
      </form>
      {success && (
        <Alert
          message={translations.messageSent || "Mensagem enviada com sucesso!"}
          type="success"
          showIcon
          className="success-alert"
        />
      )}
      {error && (
        <Alert message={error} type="error" showIcon className="error-alert" />
      )}
    </div>
  );
};

export default ContactPage;
