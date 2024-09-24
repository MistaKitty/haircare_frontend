import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Alterar aqui
import HomePage from "./components/HomePage";
import Services from "./components/Services";
import Appointments from "./components/Appointments";
import NotFound from "./components/NotFound";
import Layout from "./components/Layout";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {" "}
          <Route path="/" element={<HomePage />} /> {}
          <Route path="/services" element={<Services />} />
          <Route path="/appointments" element={<Appointments />} />{" "}
          <Route path="*" element={<NotFound />} /> {}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
