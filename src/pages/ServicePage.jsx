import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import {
  Spin,
  Card,
  Col,
  Row,
  message,
  Modal,
  Form,
  Input,
  Button,
} from "antd";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [editingService, setEditingService] = useState(null);
  const [form] = Form.useForm();
  const [isAdmin, setIsAdmin] = useState(false);

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

  useEffect(() => {
    fetchServices(); // Chama a função para buscar serviços

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsAdmin(decodedToken.role === "admin");
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  const groupedServices = services.reduce((acc, service) => {
    const { treatments, hairLength, description, price, duration } = service;
    if (!acc[treatments]) {
      acc[treatments] = [];
    }
    acc[treatments].push({
      hairLength,
      description,
      price,
      duration,
      id: service._id,
    });
    return acc;
  }, {});

  const toggleExpand = (treatment) => {
    setExpandedSections((prev) => ({
      ...prev,
      [treatment]: !prev[treatment],
    }));
  };

  const handleEdit = (service) => {
    setEditingService(service);
    form.setFieldsValue({
      hairLength: service.hairLength,
      description: service.description,
      price: service.price,
      duration: service.duration,
    });
  };

  const handleEditSubmit = async (values) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/service/${editingService.id}`,
        values
      );
      message.success("Serviço atualizado com sucesso!");
      setEditingService(null);
      fetchServices(); // Recarrega os serviços após a atualização
    } catch (err) {
      message.error(`Error: ${err.message}`);
    }
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
              {treatment} {expandedSections[treatment] ? "▲" : "▼"}
            </h2>
            {expandedSections[treatment] && (
              <Row gutter={16} className="d-flex justify-content-around">
                {groupedServices[treatment].map((service) => (
                  <Col span={8} key={service.id} className="mb-4">
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
                      {isAdmin && (
                        <Button
                          type="primary"
                          onClick={() => handleEdit(service)}
                        >
                          Editar
                        </Button>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        ))}
      </Row>

      {editingService && (
        <Modal
          title="Editar Serviço"
          visible={!!editingService}
          onCancel={() => setEditingService(null)}
          footer={null}
        >
          <Form form={form} onFinish={handleEditSubmit} layout="vertical">
            <Form.Item
              name="hairLength"
              label="Comprimento do Cabelo"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Descrição"
              rules={[{ required: true }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="price" label="Preço" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="duration"
              label="Duração (min)"
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Atualizar
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default Services;
