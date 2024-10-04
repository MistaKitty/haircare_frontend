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
  const [travelCost, setTravelCost] = useState(null);
  const [prefix, setPrefix] = useState(0);
  const [suffix, setSuffix] = useState(0);
  const [localidade, setLocalidade] = useState("");
  const [concelho, setConcelho] = useState("");
  const [freguesia, setFreguesia] = useState("");
  const [morada, setMorada] = useState("");

  const [number, setNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [description, setDescription] = useState("");
  const [showDetails, setShowDetails] = useState(false);

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

      // Log para verificar a resposta recebida
      console.log("Resposta da API de localidade:", response.data);

      // Assegure-se que a resposta contém os campos esperados
      if (response.data && response.data.location) {
        const { location, fee } = response.data;

        const { street, locality, parish, county, coordinates } = location;

        // Preencher os estados com os dados recebidos da API
        setMorada(street || "");
        setLocalidade(locality || "");
        setFreguesia(parish || "");
        setConcelho(county || "");
        setTravelCost(fee); // Define a taxa de deslocação
        setShowDetails(true); // Exibe os detalhes após a resposta
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
              </List>
            </Card>
          )}
          {travelCost && (
            <div>
              <Divider />
              <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
                Valor da Taxa de Deslocação: {travelCost}
              </Text>
            </div>
          )}
        </Card>
      ) : (
        <>
          {cart.length > 0 ? (
            <Card
              title="Carrinho"
              bordered
              style={{ width: "400px", margin: "0 auto" }}
            >
              {cart.map((item, index) => (
                <Card
                  key={item.serviceId._id}
                  style={{
                    marginBottom: "10px",
                    backgroundColor: "white",
                    pointerEvents: index === 0 ? "none" : "auto",
                  }}
                >
                  <Title level={5}>{item.serviceId.name}</Title>
                  <Text>
                    Preço: €{item.serviceId.price} x {item.quantity}
                  </Text>
                  <div style={{ marginTop: "10px" }}>
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) => handleQuantityChange(value, index)}
                    />
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveItem(index)}
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "red",
                        color: "white",
                      }}
                    />
                  </div>
                </Card>
              ))}
              <Divider />
              <Text>Total: €{calculateTotal()}</Text>
              <Divider />
              <Button type="primary" onClick={handleCheckout}>
                Finalizar Compra
              </Button>
            </Card>
          ) : (
            <Text>O carrinho está vazio.</Text>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
