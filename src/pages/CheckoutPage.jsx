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
  DatePicker,
  TimePicker,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { jwtDecode } from "jwt-decode";

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
  const [showCalendar, setShowCalendar] = useState(false);
  const [showProceedButton, setShowProceedButton] = useState(false);
  const [showCalculateButton, setShowCalculateButton] = useState(true);
  const [porta, setPorta] = useState("");
  const [andar, setAndar] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

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
        `${import.meta.env.VITE_API_URL_REMOTE}/api/cart/localidade`,
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
        setShowSummary(true);
        setShowProceedButton(true);
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

  const finishCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const serviceCounts = cart.reduce((acc, item) => {
        const id = item.serviceId._id;
        if (acc[id]) {
          acc[id] += item.quantity;
        } else {
          acc[id] = item.quantity;
        }
        return acc;
      }, {});

      const services = Object.keys(serviceCounts);
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const checkoutData = {
        location: {
          postalCodePrefix: String(prefix),
          postalCodeSuffix: String(suffix),
          number: porta,
          floor: andar,
        },
        description,
        user: userId,
        date: selectedDate ? selectedDate.toISOString() : null,
        services: services,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL_REMOTE}/api/appointment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(checkoutData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao processar checkout");
      }

      const deleteCartResponse = await fetch(
        `${import.meta.env.VITE_API_URL_REMOTE}/api/cart`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!deleteCartResponse.ok) {
        throw new Error("Erro ao remover itens do carrinho");
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao processar checkout:", error);
    }
  };

  const handleFetchLocalidade = () => {
    if (prefix && suffix) {
      fetchLocalidade(prefix, suffix);
    } else {
      console.error("Prefixo e sufixo devem ser fornecidos.");
    }
  };

  const handleProceedToBuy = () => {
    setShowSummary(true);
    setShowCalendar(true);
    setIsCheckout(false);
    setShowCalculateButton(false);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Title level={1}>Carrinho</Title>
      {isCheckout ? (
        <Card
          title={<Title level={3}>Compra</Title>}
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

          <Button
            type="primary"
            onClick={handleFetchLocalidade}
            style={{ display: showCalculateButton ? "block" : "none" }}
          >
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
                    value={porta}
                    onChange={(e) => setPorta(e.target.value)}
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
                    value={andar}
                    onChange={(e) => setAndar(e.target.value)}
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

          {showSummary && (
            <Card bordered style={{ padding: "10px", marginTop: "20px" }}>
              <Text strong>Taxa de Deslocação: {travelCost} €</Text>
              <br />
              <Text strong>Total: {totalFinal} €</Text>
              <Divider />
              <Button
                type="primary"
                onClick={() => {
                  setShowCalendar(true);
                  setShowSummary(false);
                  setShowDetails(false);
                  setShowCalculateButton(false);
                  setisCheckout(false);
                }}
              >
                Confirmar Compra
              </Button>
            </Card>
          )}
          {showCalendar && (
            <div style={{ marginTop: "20px" }}>
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={(current) => {
                  return (
                    current && (current.day() === 0 || current.day() === 6)
                  );
                }}
                onChange={(date) => setSelectedDate(date)}
              />
              <TimePicker
                style={{ width: "100%", marginTop: "20px" }}
                format="HH:mm"
                minuteStep={15}
                disabledHours={() => {
                  const hours = [];
                  for (let i = 0; i < 9; i++) {
                    hours.push(i);
                  }
                  for (let i = 19; i < 24; i++) {
                    hours.push(i);
                  }
                  return hours;
                }}
                onChange={(time) => setSelectedTime(time)}
              />
              <br />
              <br />
              <Button type="primary" onClick={finishCheckout}>
                Agendar!
              </Button>
            </div>
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
          <Button type="primary" onClick={handleCheckout}>
            Prosseguir para Checkout
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CartPage;
