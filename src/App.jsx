import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./components/HomePage";
import Services from "./pages/ServicePage";
import Appointments from "./pages/AppointmentsPage";
import NotFound from "./components/NotFound";
import Layout from "./components/Layout";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import About from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token"));
};

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/appointments"
            element={<PrivateRoute element={<Appointments />} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
