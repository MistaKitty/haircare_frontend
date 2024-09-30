import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Table, Typography, Alert, Space, Spin, Modal } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AppointmentsPage.css"; // Ajusta o nome do CSS conforme necessário
import Cookies from "js-cookie";

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

  const navigate = useNavigate();
  const language = Cookies.get("language") || "PT";

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translationModule = await import(
          `../data/translations/${language}.json`
        );
        setTranslations(translationModule);
      } catch (err) {
        console.error("Error loading translations:", err);
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
        ? `${import.meta.env.VITE_API_URL_REMOTE}/api/appointments`
        : `${import.meta.env.VITE_BACKEND_URL}/api/appointments`;

      const response = await axios.get(apiUrl);
      setAppointments(response.data);
    } catch (err) {
      setError(translations.unexpectedError);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (appointmentId) => {
    try {
      const apiUrl = isRemote
        ? `${
            import.meta.env.VITE_API_URL_REMOTE
          }/api/appointments/accept/${appointmentId}`
        : `${
            import.meta.env.VITE_BACKEND_URL
          }/api/appointments/accept/${appointmentId}`;

      await axios.post(apiUrl);
      setSuccess(translations.appointmentAccepted);
      fetchAppointments();
    } catch (err) {
      setError(translations.unexpectedError);
    }
  };

  const handleReject = async (appointmentId) => {
    try {
      const apiUrl = isRemote
        ? `${
            import.meta.env.VITE_API_URL_REMOTE
          }/api/appointments/reject/${appointmentId}`
        : `${
            import.meta.env.VITE_BACKEND_URL
          }/api/appointments/reject/${appointmentId}`;

      await axios.post(apiUrl);
      setSuccess(translations.appointmentRejected);
      fetchAppointments();
    } catch (err) {
      setError(translations.unexpectedError);
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
      dataIndex: "date",
      key: "date",
    },
    {
      title: translations.time,
      dataIndex: "time",
      key: "time",
    },
    {
      title: translations.clientEmail,
      dataIndex: "clientEmail",
      key: "clientEmail",
    },
    {
      title: translations.status,
      dataIndex: "status",
      key: "status",
    },
    {
      title: translations.actions,
      key: "actions",
      render: (text, appointment) => (
        <Space size="middle">
          <Button onClick={() => handleAccept(appointment._id)}>
            {translations.accept}
          </Button>
          <Button onClick={() => handleReject(appointment._id)}>
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
              {selectedAppointment.clientEmail}
            </p>
            <p>
              <strong>{translations.date}: </strong>
              {selectedAppointment.date}
            </p>
            <p>
              <strong>{translations.time}: </strong>
              {selectedAppointment.time}
            </p>
            <p>
              <strong>{translations.status}: </strong>
              {selectedAppointment.status}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentsPage;
