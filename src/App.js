import React from "react";
import "./App.css";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import HomePage from "./components/HomePage";

function App() {
  return (
    <div className="App">
      <Header />
      <HomePage />
      <Footer />
    </div>
  );
}

export default App;
