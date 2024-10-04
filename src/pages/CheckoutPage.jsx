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
  const [postalCodePrefix, setPostalCodePrefix] = useState("");
  const [postalCodeSuffix, setPostalCodeSuffix] = useState("");
  const [totalWithFees, setTotalWithFees] = useState(null);
  const [localityInfo, setLocalityInfo] = useState(null);
  const [cttApiKey, setCttApiKey] = useState("");

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

    const fetchCttApiKey = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL_REMOTE}/api/get-ctt-api-key`
        );
        setCttApiKey(response.data.key);
      } catch (error) {
        console.error("Erro ao obter a chave da API dos CTT:", error);
      }
    };

    fetchCart();
    fetchCttApiKey();
  }, []);

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.serviceId.price * item.quantity, 0)
      .toFixed(2);
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

  const handleCheckout = async () => {
    const postalCode = `${postalCodePrefix}-${postalCodeSuffix}`;

    try {
      const response = await axios.get(
        `https://www.cttcodigopostal.pt/api/v1/${cttApiKey}/${postalCode}`
      );
      setLocalityInfo(response.data);

      // Adicione este console.log para verificar a resposta da API
      console.log("Informação da localidade:", response.data);

      const token = localStorage.getItem("token");
      const appointmentResponse = await axios.post(
        `${import.meta.env.VITE_API_URL_REMOTE}/api/appointments`,
        {
          location: {
            postalCodePrefix,
            postalCodeSuffix,
          },
          services: cart.map((item) => item.serviceId._id),
          date: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTotalWithFees(appointmentResponse.data.billing.total);
    } catch (error) {
      console.error("Erro ao calcular total com taxas:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={1}>Carrinho</Title>
      {isCheckout ? (
        <Card
          title="Checkout"
          bordered
          style={{ width: "400px", margin: "0 auto" }}
        >
          <Text>Introduza o Código Postal:</Text>
          <div className="d-flex justify-content-center mb-3">
            <Input
              placeholder="Prefixo"
              value={postalCodePrefix}
              onChange={(e) => setPostalCodePrefix(e.target.value)}
              style={{ width: "100px", marginRight: "10px" }}
            />
            <Input
              placeholder="Sufixo"
              value={postalCodeSuffix}
              onChange={(e) => setPostalCodeSuffix(e.target.value)}
              style={{ width: "100px" }}
            />
          </div>
          <Button type="primary" onClick={handleCheckout}>
            Calcular Total
          </Button>
          {totalWithFees && (
            <div>
              <Divider />
              <Text strong>Total com Taxas: €{totalWithFees}</Text>
            </div>
          )}
          {localityInfo && (
            <div>
              <Divider />
              <Text strong>Localidade: {localityInfo.localidade}</Text>
            </div>
          )}
        </Card>
      ) : (
        <>
          {cart.length > 0 ? (
            <Card
              title="Serviços no Carrinho"
              bordered
              style={{ width: "400px", margin: "0 auto" }}
            >
              <List
                dataSource={cart}
                renderItem={(item, index) => (
                  <List.Item key={item._id}>
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <div className="flex-grow-1">
                        <Text strong>{item.serviceId.treatments}</Text>
                      </div>
                      <div className="flex-grow-0">
                        <Text>
                          €{(item.serviceId.price * item.quantity).toFixed(2)}
                        </Text>
                      </div>
                      <div className="flex-grow-0">
                        <InputNumber
                          min={1}
                          value={item.quantity}
                          onChange={(value) =>
                            handleQuantityChange(value, index)
                          }
                        />
                      </div>
                      <div className="flex-grow-0">
                        <DeleteOutlined
                          onClick={() => handleRemoveItem(index)}
                          style={{ color: "red", cursor: "pointer" }}
                        />
                      </div>
                    </div>
                  </List.Item>
                )}
              />
              <Divider />
              <div className="d-flex justify-content-between align-items-center">
                <Title level={2}>Total:</Title>
                <Text>€{calculateTotal()}</Text>
              </div>
              <Button type="primary" onClick={() => setIsCheckout(true)}>
                Seguir para Checkout
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
