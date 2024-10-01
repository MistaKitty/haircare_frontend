import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spin, Card, Col, Row, message } from "antd";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const apiUrl =
          import.meta.env.VITE_APP_USE_REMOTE === "true"
            ? import.meta.env.VITE_API_URL_REMOTE + "/api/service"
            : import.meta.env.VITE_BACKEND_URL + "/api/service";

        const response = await axios.get(apiUrl);
        setServices(response.data);
      } catch (err) {
        setError(err.message);
        message.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const groupedServices = services.reduce((acc, service) => {
    const { treatments, hairLength, description, price, duration } = service;
    if (!acc[treatments]) {
      acc[treatments] = [];
    }
    acc[treatments].push({ hairLength, description, price, duration });
    return acc;
  }, {});

  const toggleExpand = (treatment) => {
    setExpandedSections((prev) => ({
      ...prev,
      [treatment]: !prev[treatment],
    }));
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-black text-white">
      <h1 className="text-center">Nossos Serviços</h1>
      <p className="text-center">Detalhes sobre os serviços que oferecemos:</p>
      <Row gutter={16} className="mt-4">
        {Object.keys(groupedServices).map((treatment) => (
          <Col span={24} key={treatment} className="mb-4">
            <h2
              className="d-flex flex-column align-items-center mt-4 mb-2"
              onClick={() => toggleExpand(treatment)}
              style={{ cursor: "pointer" }}
            >
              {treatment} {expandedSections[treatment] ? "▲" : "▼"}{" "}
            </h2>
            {expandedSections[treatment] && (
              <Row gutter={16} className="d-flex justify-content-around">
                {groupedServices[treatment].map((service, index) => (
                  <Col span={8} key={index} className="mb-4">
                    <Card
                      bordered={false}
                      className="bg-gray-800 text-white"
                      title={
                        <div className="ant-card-head-title d-flex justify-content-between">
                          <span className="flex-auto text-left">
                            {service.hairLength}
                          </span>
                          <span className="flex-auto text-center mx-auto">
                            {Math.floor(service.duration / 60)} min
                          </span>
                          <span className="flex-auto text-right">
                            €{service.price}
                          </span>
                        </div>
                      }
                    >
                      <p className="text-white text-center">
                        {service.description}
                      </p>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Services;
