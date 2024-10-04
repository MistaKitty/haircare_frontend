import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Typography, Alert, Space, Spin, Modal, Table } from "antd";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        console.error("Erro ao carregar traduções:", error);
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
      console.error("Erro ao carregar agendamentos:", error);
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
        ] || "Ação realizada com sucesso."
      );
      fetchAppointments();
    } catch (error) {
      console.error("Erro ao realizar ação no agendamento:", error);
      setError(
        translations.unexpectedError || "Erro inesperado ao realizar a ação."
      );
    }
  };

  const handleModalOpen = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const columns = [
    {
      title: translations.date || "Data",
      dataIndex: "date",
      render: (text, record) =>
        dayjs(record.appointmentDetails.date).format("DD/MM/YYYY"),
    },
    {
      title: translations.time || "Hora",
      dataIndex: "time",
      render: (text, record) =>
        dayjs(record.appointmentDetails.date).format("HH:mm"),
    },
    {
      title: translations.clientEmail || "Email do Cliente",
      dataIndex: "clientEmail",
      render: (text, record) => record.user.email,
    },
    {
      title: translations.status || "Estado",
      dataIndex: "status",
      render: (text, record) => record.appointmentDetails.status,
    },
    {
      title: translations.actions || "Ações",
      dataIndex: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            onClick={() => handleAppointmentAction(record.id, "accept")}
            disabled={record.appointmentDetails.status !== "pending"}
          >
            {translations.accept || "Aceitar"}
          </Button>
          <Button
            onClick={() => handleAppointmentAction(record.id, "reject")}
            disabled={record.appointmentDetails.status !== "pending"}
          >
            {translations.reject || "Rejeitar"}
          </Button>
          <Button onClick={() => handleModalOpen(record)}>
            {translations.viewDetails || "Ver Detalhes"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container-fluid p-4">
      <Title level={2} className="text-center text-white">
        {translations.appointments || "Agendamentos"}
      </Title>
      {loading && (
        <div className="text-center">
          <Spin size="large" className="my-4" />
          <Typography.Text className="d-block italic text-white">
            {translations.loadingAppointments || "A carregar agendamentos..."}
          </Typography.Text>
        </div>
      )}
      {error && (
        <Alert message={error} type="error" showIcon className="mb-3" />
      )}
      {success && (
        <Alert message={success} type="success" showIcon className="mb-3" />
      )}

      <div className="table-responsive">
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </div>

      <Modal
        title={translations.appointmentDetails || "Detalhes do Agendamento"}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedAppointment && (
          <div>
            <p>
              <strong>
                {translations.clientEmail || "Email do Cliente"}:{" "}
              </strong>
              {selectedAppointment.user.email}
            </p>
            <p>
              <strong>{translations.date || "Data"}: </strong>
              {dayjs(selectedAppointment.appointmentDetails.date).format(
                "DD/MM/YYYY"
              )}
            </p>
            <p>
              <strong>{translations.time || "Hora"}: </strong>
              {dayjs(selectedAppointment.appointmentDetails.date).format(
                "HH:mm"
              )}
            </p>
            <p>
              <strong>{translations.status || "Estado"}: </strong>
              {selectedAppointment.appointmentDetails.status}
            </p>
            <p>
              <strong>{translations.services || "Serviços"}: </strong>
              {selectedAppointment.appointmentDetails.services
                .map((service) => service.name)
                .join(", ")}
            </p>
            <p>
              <strong>{translations.location || "Localização"}: </strong>
              {`${selectedAppointment.appointmentDetails.location.street}, ${selectedAppointment.appointmentDetails.location.locality}`}
            </p>
            <p>
              <strong>{translations.billing || "Cobrança"}: </strong>
              {selectedAppointment.appointmentDetails.billing}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentsPage;
