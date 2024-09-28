import React from "react";
import translations from "../data/translations/pt.json";
import { Typography, Divider, Space } from "antd";
import "./AboutPage.css";

const { Title, Text } = Typography;

const About = () => {
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
          {about}
        </Title>
        <Text className="white-text large-text">{aboutDescription}</Text>

        <Divider className="white-line" />

        <Title level={3} className="white-text">
          {ourMission}
        </Title>
        <Text className="white-text large-text">{missionDescription}</Text>

        <Divider className="white-line" />

        <Title level={3} className="white-text">
          {ourValues}
        </Title>
        <ul className="list-unstyled">
          <li className="white-text large-text">{valueQuality}</li>
          <li className="white-text large-text">{valueCustomerCare}</li>
          <li className="white-text large-text">{valueInnovation}</li>
        </ul>

        <Divider className="white-line" />

        <Title level={3} className="white-text">
          {servicesOffered}
        </Title>
        <Text className="white-text large-text">{servicesDescription}</Text>
      </Space>
    </div>
  );
};

export default About;
