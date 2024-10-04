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

const { Title, Text } = Typography;

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [travelCost, setTravelCost] = useState(null);
  const [prefix, setPrefix] = useState(0);
  const [suffix, setSuffix] = useState(0);
  const [localidade, setLocalidade] = useState("");
  const [concelho, setConcelho] = useState("");

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
        `${import.meta.env.VITE_API_URL_REMOTE}/api/cart/localidade`,
        { postalCodePrefix: prefix, postalCodeSuffix: suffix },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLocalidade(response.data.local);
      setConcelho(response.data.concelho);
    } catch (error) {
      console.error("Erro ao obter a localidade:", error);
      setLocalidade("");
      setConcelho("");
    }
  };

  const calculateTaxes = async () => {
    const total = parseFloat(calculateTotal());
    const tax = (total + prefix + suffix) * 0.1;
    setTravelCost(tax.toFixed(2));

    await fetchLocalidade(prefix, suffix);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={1} style={{ textAlign: "center" }}>
        Carrinho
      </Title>
      {isCheckout ? (
        <Card
          title="Calcular Taxas"
          bordered
          style={{ width: "400px", margin: "0 auto" }}
        >
          <Text style={{ fontSize: "16px" }}>Prefixo:</Text>
          <InputNumber
            value={prefix}
            onChange={setPrefix}
            style={{ width: "100px", marginRight: "10px" }}
          />
          <Text style={{ fontSize: "16px" }}>Sufixo:</Text>
          <InputNumber
            value={suffix}
            onChange={setSuffix}
            style={{ width: "100px", marginRight: "10px" }}
          />
          <Divider />
          <Text style={{ fontSize: "16px" }}>Localidade:</Text>
          <Input value={localidade} disabled style={{ marginBottom: "10px" }} />
          <Text style={{ fontSize: "16px" }}>Concelho:</Text>
          <Input value={concelho} disabled style={{ marginBottom: "10px" }} />
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <Button type="primary" onClick={calculateTaxes}>
              Calcular Taxas
            </Button>
          </div>
          {travelCost && (
            <div>
              <Divider />
              <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
                Valor da Taxa de Deslocação: €{travelCost}
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
              <List
                itemLayout="horizontal"
                dataSource={cart}
                renderItem={(item, index) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        onClick={() => handleRemoveItem(index)}
                        icon={<DeleteOutlined />}
                      >
                        Remover
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={item.serviceId.name}
                      description={`Preço: €${item.serviceId.price} | Quantidade: `}
                    />
                    <InputNumber
                      min={1}
                      defaultValue={item.quantity}
                      onChange={(value) => handleQuantityChange(value, index)}
                      style={{ width: "70px" }}
                    />
                  </List.Item>
                )}
              />
              <Divider />
              <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
                Total: €{calculateTotal()}
              </Text>
              <Divider />
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <Button type="primary" onClick={handleCheckout}>
                  Checkout
                </Button>
              </div>
            </Card>
          ) : (
            <Text style={{ textAlign: "center" }}>
              O seu carrinho está vazio.
            </Text>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
