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
  Switch,
  InputNumber,
} from "antd";

const Services = ({ cart, setCart }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [editingService, setEditingService] = useState(null);
  const [addingService, setAddingService] = useState(false);
  const [form] = Form.useForm();
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchServices = async () => {
    try {
      const apiUrl =
        import.meta.env.VITE_APP_USE_REMOTE === "true"
          ? import.meta.env.VITE_API_URL_REMOTE + "/api/service"
          : import.meta.env.VITE_BACKEND_URL + "/api/service";

      const token = localStorage.getItem("token");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServices(response.data);
    } catch (err) {
      setError(err.message);
      message.error(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsAdmin(decodedToken.role === "admin");
      } catch (error) {
        console.error("Token inválido:", error);
      }
    }
  }, []);

  const filteredServices = isAdmin
    ? services
    : services.filter((service) => service.isActive);

  const groupedServices = filteredServices.reduce((acc, service) => {
    const { treatments, hairLength, description, price, duration, isActive } =
      service;
    if (!acc[treatments]) {
      acc[treatments] = [];
    }
    acc[treatments].push({
      hairLength,
      description,
      price,
      duration,
      isActive,
      _id: service._id,
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
      treatments: service.treatments,
      hairLength: service.hairLength,
      description: service.description,
      price: service.price,
      duration: service.duration / 60,
    });
  };

  const handleEditSubmit = async (values) => {
    try {
      const updatedValues = {
        ...values,
        duration: Number(values.duration) * 60,
      };

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/service/${editingService._id}`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.success("Serviço atualizado com sucesso!");
      setEditingService(null);
      fetchServices();
    } catch (err) {
      message.error(`Erro ao atualizar o serviço: ${err.message}`);
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/service/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.success("Serviço removido com sucesso!");
      fetchServices();
    } catch (err) {
      message.error(`Erro ao remover o serviço: ${err.message}`);
    }
  };

  const handleHide = async (id, isActive) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/service/${id}`,
        {
          isActive: !isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.success(
        isActive
          ? "Serviço escondido com sucesso!"
          : "Serviço mostrado com sucesso!"
      );
      fetchServices();
    } catch (err) {
      message.error(
        `Erro ao ${isActive ? "esconder" : "mostrar"} o serviço: ${err.message}`
      );
    }
  };

  const handleAddSubmit = async (values) => {
    try {
      const price = Number(values.price);
      const duration = Number(values.duration) * 60;

      if (isNaN(price) || isNaN(duration)) {
        throw new Error("Preço e Duração devem ser números válidos.");
      }
      const newService = {
        ...values,
        duration,
        price,
        isActive: true,
      };

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/service`,
        newService,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.success("Serviço adicionado com sucesso!");
      setAddingService(false);
      fetchServices();
    } catch (err) {
      message.error(`Erro ao adicionar o serviço: ${err.message}`);
    }
  };

  const handleAddToCart = (service) => {
    setCart((prevCart) => [...prevCart, service]);
    message.success(`${service.treatments} adicionado ao carrinho!`);
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Erro: {error}</div>;
  }

  return (
    <div className="p-4 bg-black text-white">
      <h1 className="text-center">Nossos Serviços</h1>
      <p className="text-center">Detalhes sobre os serviços que oferecemos:</p>
      {isAdmin && (
        <div className="d-flex justify-content-center mb-4">
          <Button type="primary" onClick={() => setAddingService(true)}>
            Adicionar Serviço
          </Button>
        </div>
      )}
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
                  <Col span={8} key={service._id} className="mb-4">
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
                      <div className="d-flex justify-content-between align-items-center">
                        <Button
                          type="default"
                          onClick={() => handleAddToCart(service)}
                        >
                          Adicionar ao Carrinho
                        </Button>
                        {isAdmin && (
                          <>
                            <Button
                              type="primary"
                              onClick={() => handleEdit(service)}
                            >
                              Editar
                            </Button>
                            <Button
                              danger
                              onClick={() => {
                                Modal.confirm({
                                  title:
                                    "Tem a certeza que deseja remover este serviço?",
                                  onOk: () => handleRemove(service._id),
                                });
                              }}
                            >
                              Remover
                            </Button>
                            <Switch
                              checked={service.isActive}
                              onChange={() => {
                                handleHide(service._id, service.isActive);
                              }}
                              checkedChildren="Ativo"
                              unCheckedChildren="Inativo"
                            />
                          </>
                        )}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        ))}
      </Row>
      <Modal
        visible={!!editingService}
        title="Editar Serviço"
        onCancel={() => setEditingService(null)}
        footer={null}
      >
        <Form form={form} onFinish={handleEditSubmit}>
          <Form.Item
            name="treatments"
            label="Tratamento"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="hairLength"
            label="Comprimento do Cabelo"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descrição"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="price"
            label="Preço"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <InputNumber min={0} step={0.01} />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Duração (min)"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Atualizar Serviço
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={addingService}
        title="Adicionar Serviço"
        onCancel={() => setAddingService(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddSubmit}>
          <Form.Item
            name="treatments"
            label="Tratamento"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="hairLength"
            label="Comprimento do Cabelo"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descrição"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="price"
            label="Preço"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <InputNumber min={0} step={0.01} />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Duração (min)"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Adicionar Serviço
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Services;
