import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  List,
  Typography,
  Divider,
  InputNumber,
  Button,
  Input,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";

const { Title, Text } = Typography;

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [travelCost, setTravelCost] = useState("0");
  const [prefix, setPrefix] = useState(0);
  const [suffix, setSuffix] = useState(0);
  const [localidade, setLocalidade] = useState("");
  const [concelho, setConcelho] = useState("");
  const [freguesia, setFreguesia] = useState("");
  const [morada, setMorada] = useState("");
  const [floor, setFloor] = useState("");
  const [street, setStreet] = useState("");
  const [description, setDescription] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL_REMOTE}/api/cart`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCart(response.data);
      } catch (error) {
        console.error(
          "Erro ao obter o carrinho:",
          error.response?.data || error.message
        );
      }
    };

    fetchCart();
  }, []);

  const calculateTotal = () => {
    const total = cart
      .reduce((total, item) => total + item.serviceId.price * item.quantity, 0)
      .toFixed(2);
    return total;
  };
  const totalFinal = (() => {
    const parsedTravelCost = travelCost
      ? parseFloat(travelCost.replace("€", "").trim()) || 0
      : 0;

    const calculatedTotal = parseFloat(calculateTotal()) || 0;

    return (calculatedTotal + parsedTravelCost).toFixed(2);
  })();

  const handleQuantityChange = async (value, index) => {
    const newCart = [...cart];
    newCart[index].quantity = value;
    setCart(newCart);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL_REMOTE}/api/cart/edit`,
        { serviceId: newCart[index].serviceId._id, quantity: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Erro ao atualizar a quantidade:", error);
    }
  };

  const handleRemoveItem = async (index) => {
    const itemToRemove = cart[index];
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL_REMOTE}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { serviceId: itemToRemove.serviceId._id },
      });
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error);
    }
  };

  const handleCheckout = () => {
    setIsCheckout(true);
  };

  const fetchLocalidade = async (prefix, suffix) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/localidade`,
        { postalCodePrefix: prefix, postalCodeSuffix: suffix },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Resposta da API de localidade:", response.data);

      if (response.data && response.data.location) {
        const { location, fee } = response.data;

        const { street, locality, parish, county, coordinates } = location;

        setMorada(street || "");
        setLocalidade(locality || "");
        setFreguesia(parish || "");
        setConcelho(county || "");
        setStreet(street || "");
        setTravelCost(fee);
        setShowDetails(true);
      } else {
        console.error("Resposta da API não contém os dados esperados.");
      }
    } catch (error) {
      console.error("Erro ao obter a localidade:", error);
      setMorada("");
      setLocalidade("");
      setFreguesia("");
      setConcelho("");
    }
  };

  const handleFetchLocalidade = () => {
    if (prefix && suffix) {
      fetchLocalidade(prefix, suffix);
    } else {
      console.error("Prefixo e sufixo devem ser fornecidos.");
    }
  };

  const handleProceedToSummary = () => {
    setShowSummary(true); // Exibe o resumo
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Title level={1}>Carrinho</Title>
      {isCheckout ? (
        <Card
          title={<Title level={3}>Calcular Taxas</Title>}
          bordered
          style={{ width: "400px", margin: "0 auto" }}
        >
          <div>
            <Text style={{ fontSize: "16px" }}>Prefixo:</Text>
            <InputNumber
              value={prefix}
              onChange={(value) => setPrefix(value)}
              style={{ width: "60px", margin: "10px" }}
            />
            <Text style={{ fontSize: "16px" }}>Sufixo:</Text>
            <InputNumber
              value={suffix}
              onChange={(value) => setSuffix(value)}
              style={{ width: "60px", margin: "10px" }}
            />
            <Divider />
          </div>
          <Divider />
          <Button type="primary" onClick={handleFetchLocalidade}>
            Calcular Taxas
          </Button>
          {showDetails && (
            <Card bordered style={{ padding: "10px", marginTop: "20px" }}>
              <List>
                <List.Item>
                  <Text
                    strong
                    style={{ width: "120px", display: "inline-block" }}
                  >
                    Morada:
                  </Text>
                  <Input
                    value={morada}
                    onChange={(e) => setMorada(e.target.value)}
                    style={{ width: "120px", marginLeft: "10px" }}
                  />
                </List.Item>
                <List.Item>
                  <Text
                    strong
                    style={{ width: "120px", display: "inline-block" }}
                  >
                    Rua:
                  </Text>
                  <Input
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    style={{ width: "120px", marginLeft: "10px" }}
                  />
                </List.Item>
                <List.Item>
                  <Text
                    strong
                    style={{ width: "120px", display: "inline-block" }}
                  >
                    Localidade:
                  </Text>
                  <Input
                    value={localidade}
                    onChange={(e) => setLocalidade(e.target.value)}
                    style={{ width: "120px", marginLeft: "10px" }}
                  />
                </List.Item>
                <List.Item>
                  <Text
                    strong
                    style={{ width: "120px", display: "inline-block" }}
                  >
                    Concelho:
                  </Text>
                  <Input
                    value={concelho}
                    onChange={(e) => setConcelho(e.target.value)}
                    style={{ width: "120px", marginLeft: "10px" }}
                  />
                </List.Item>
                <List.Item>
                  <Text
                    strong
                    style={{ width: "120px", display: "inline-block" }}
                  >
                    Freguesia:
                  </Text>
                  <Input
                    value={freguesia}
                    onChange={(e) => setFreguesia(e.target.value)}
                    style={{ width: "120px", marginLeft: "10px" }}
                  />
                </List.Item>
                <List.Item>
                  <Text
                    strong
                    style={{ width: "120px", display: "inline-block" }}
                  >
                    Porta:
                  </Text>
                  <Input
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    style={{ width: "120px", marginLeft: "10px" }}
                  />
                </List.Item>
                <List.Item>
                  <Text
                    strong
                    style={{ width: "120px", display: "inline-block" }}
                  >
                    Andar:
                  </Text>
                  <Input
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    style={{ width: "120px", marginLeft: "10px" }}
                  />
                </List.Item>
                <List.Item>
                  <Text
                    strong
                    style={{ width: "120px", display: "inline-block" }}
                  >
                    Descrição:
                  </Text>
                  <Input.TextArea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ width: "120px", marginLeft: "10px" }}
                  />
                </List.Item>
              </List>
            </Card>
          )}
          <Divider />
          <Button
            type="primary"
            onClick={handleProceedToSummary}
            style={{ marginTop: "20px" }}
          >
            Seguir
          </Button>
          {showSummary && (
            <Card bordered style={{ padding: "10px", marginTop: "20px" }}>
              <Text strong>Taxa de Deslocação: {travelCost} €</Text>
              <br />
              <Text strong>Total: {totalFinal} €</Text>
              <Divider />
              <Button type="primary" onClick={handleCheckout}>
                Confirmar Compra
              </Button>
            </Card>
          )}
        </Card>
      ) : (
        <Card bordered style={{ width: "400px", margin: "0 auto" }}>
          <Title level={3}>Resumo do Carrinho</Title>
          <List
            dataSource={cart}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remover
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.serviceId.name}
                  description={`Preço: ${item.serviceId.price} €`}
                />
                <InputNumber
                  min={1}
                  defaultValue={item.quantity}
                  onChange={(value) => handleQuantityChange(value, index)}
                />
              </List.Item>
            )}
          />
          <Divider />
          <Text strong>Total: {totalFinal} €</Text>
          <Divider />
          <Button type="primary" onClick={() => setIsCheckout(true)}>
            Prosseguir para Checkout
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CartPage;
