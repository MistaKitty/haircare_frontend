import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Table, Typography, Alert, Space, Spin, Modal } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AppointmentsPage.css";
import Cookies from "js-cookie";
import dayjs from "dayjs";

const { Title } = Typography;

const isRemote = import.meta.env.VITE_APP_USE_REMOTE === "true";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [translations, setTranslations] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const language = Cookies.get("language") || "PT";
  const navigate = useNavigate();

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translationModule = await import(
          `../data/translations/${language}.json`
        );
        setTranslations(translationModule);
      } catch (error) {
        console.error("Error loading translations:", error);
        setTranslations({});
      }
    };

    loadTranslations();
    fetchAppointments();
  }, [language]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const apiUrl = isRemote
        ? `${import.meta.env.VITE_API_URL_REMOTE}/api/appointment`
        : `${import.meta.env.VITE_BACKEND_URL}/api/appointment`;

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token não encontrado. Por favor, faça login.");
        return;
      }

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      if (error.response && error.response.status === 401) {
        setError("Erro de autenticação. Por favor, faça login novamente.");
        navigate("/login");
      } else {
        setError(
          translations.unexpectedError ||
            "Erro inesperado ao carregar agendamentos."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      const apiUrl = isRemote
        ? `${
            import.meta.env.VITE_API_URL_REMOTE
          }/api/appointments/${action}/${appointmentId}`
        : `${
            import.meta.env.VITE_BACKEND_URL
          }/api/appointments/${action}/${appointmentId}`;

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token não encontrado. Por favor, faça login.");
        return;
      }

      await axios.post(
        apiUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(
        translations[
          `${action.charAt(0).toUpperCase() + action.slice(1)}Appointment`
        ]
      );
      fetchAppointments();
    } catch (error) {
      console.error("Error performing appointment action:", error);
      setError(
        translations.unexpectedError || "Erro inesperado ao realizar a ação."
      );
    }
  };

  const handleModalOpen = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedAppointment(null);
  };

  const columns = [
    {
      title: translations.date,
      dataIndex: "appointment.date",
      key: "date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: translations.time,
      dataIndex: "appointment.date",
      key: "time",
      render: (date) => dayjs(date).format("HH:mm"),
    },
    {
      title: translations.clientEmail,
      dataIndex: "user.email",
      key: "clientEmail",
    },
    {
      title: translations.status,
      dataIndex: "appointment.status",
      key: "status",
    },
    {
      title: translations.actions,
      key: "actions",
      render: (text, appointment) => (
        <Space size="middle">
          <Button
            onClick={() => handleAppointmentAction(appointment._id, "accept")}
            disabled={appointment.status !== "pending"}
          >
            {translations.accept}
          </Button>
          <Button
            onClick={() => handleAppointmentAction(appointment._id, "reject")}
            disabled={appointment.status !== "pending"}
          >
            {translations.reject}
          </Button>
          <Button onClick={() => handleModalOpen(appointment)}>
            {translations.viewDetails}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container">
      <Title level={2} className="text-center text-white">
        {translations.appointments}
      </Title>
      {loading && (
        <div className="text-center">
          <Spin size="large" className="my-4" />
          <Typography.Text className="d-block italic text-white">
            {translations.loadingAppointments}
          </Typography.Text>
        </div>
      )}
      {error && (
        <Alert message={error} type="error" showIcon className="mb-3" />
      )}
      {success && (
        <Alert message={success} type="success" showIcon className="mb-3" />
      )}
      <Table dataSource={appointments} columns={columns} rowKey="_id" />
      <Modal
        title={translations.appointmentDetails}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedAppointment && (
          <div>
            <p>
              <strong>{translations.clientEmail}: </strong>
              {selectedAppointment.user.email}
            </p>
            <p>
              <strong>{translations.date}: </strong>
              {dayjs(selectedAppointment.appointment.date).format("DD/MM/YYYY")}
            </p>
            <p>
              <strong>{translations.time}: </strong>
              {dayjs(selectedAppointment.appointment.date).format("HH:mm")}
            </p>
            <p>
              <strong>{translations.status}: </strong>
              {selectedAppointment.appointment.status}
            </p>
            <p>
              <strong>{translations.services}: </strong>
              {selectedAppointment.appointment.services
                .map((service) => service.serviceName)
                .join(", ")}
            </p>
            <p>
              <strong>{translations.location}: </strong>
              {`${selectedAppointment.appointment.location.street}, ${selectedAppointment.appointment.location.locality}`}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentsPage;
