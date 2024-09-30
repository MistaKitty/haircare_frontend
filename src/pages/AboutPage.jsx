import React, { useState, useEffect } from "react";
import { Typography, Divider, Space } from "antd";
import useLanguage from "../hooks/useLanguage";
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
    <div className="about-container">
      <Space direction="vertical" size="large">
        <Title level={2} className="white-text">
          {about || "Sobre Nós"}
        </Title>
        <Text className="white-text large-text">
          {aboutDescription || "Descrição sobre a nossa empresa."}
        </Text>

        <Divider className="white-line" />

        <Title level={3} className="white-text">
          {ourMission || "A Nossa Missão"}
        </Title>
        <Text className="white-text large-text">
          {missionDescription || "Descrição da nossa missão."}
        </Text>

        <Divider className="white-line" />

        <Title level={3} className="white-text">
          {ourValues || "Os Nossos Valores"}
        </Title>
        <ul className="list-unstyled">
          <li className="white-text large-text">
            {valueQuality || "Qualidade"}
          </li>
          <li className="white-text large-text">
            {valueCustomerCare || "Atendimento ao Cliente"}
          </li>
          <li className="white-text large-text">
            {valueInnovation || "Inovação"}
          </li>
        </ul>

        <Divider className="white-line" />

        <Title level={3} className="white-text">
          {servicesOffered || "Serviços Oferecidos"}
        </Title>
        <Text className="white-text large-text">
          {servicesDescription || "Descrição dos serviços que oferecemos."}
        </Text>
      </Space>
    </div>
  );
};

export default About;
