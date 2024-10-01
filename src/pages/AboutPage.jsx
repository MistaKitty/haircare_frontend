import React, { useState, useEffect } from "react";
import { Typography, Divider, Space } from "antd";
import useLanguage from "../hooks/useLanguage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AboutPage.css";

const { Title, Text } = Typography;

const About = () => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState({});

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

  const {
    about,
    aboutDescription,
    ourMission,
    missionDescription,
    ourValues,
    valueQuality,
    valueCustomerCare,
    valueInnovation,
    servicesOffered,
    servicesDescription,
  } = translations;

  return (
    <div className="text-center text-white about-container">
      <Space direction="vertical" size={1} style={{ width: "100%" }}>
        <Title level={2} className="mb-4 text-white">
          {about || "Sobre Nós"}
        </Title>
        <Text className="mb-3 text-white">
          {aboutDescription ||
            "Oferecemos uma experiência única de beleza e bem-estar ao domicílio, com profissionais altamente qualificados e dedicados a realçar a sua beleza natural."}
        </Text>

        <Divider className="custom-divider" />

        <Title level={3} className="about-section-title mb-1 text-white">
          {ourMission || "Nossa Missão"}
        </Title>
        <Text className="mb-3 text-white">
          {missionDescription ||
            "Proporcionar serviços de alta qualidade ao domicílio que superem as expectativas dos nossos clientes e promovam a sua confiança e autoestima."}
        </Text>

        <Divider className="custom-divider" />

        <Title level={3} className="about-section-title mb-3 text-white">
          {ourValues || "Nossos Valores"}
        </Title>
        <ul className="list-unstyled">
          <li className="text-white">{valueQuality || "Qualidade"}</li>
          <li className="text-white">
            {valueCustomerCare || "Atendimento ao Cliente"}
          </li>
          <li className="text-white">{valueInnovation || "Inovação"}</li>
        </ul>

        <Divider className="custom-divider" />

        <Title level={3} className="about-section-title mb-3">
          {servicesOffered || "Serviços Oferecidos"}
        </Title>
        <Text>
          {servicesDescription || "Descrição dos serviços que oferecemos."}
        </Text>
      </Space>
    </div>
  );
};

export default About;
