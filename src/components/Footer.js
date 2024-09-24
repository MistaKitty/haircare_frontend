import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="Footer">
      <p>&copy; {new Date().getFullYear()} Hair Salon. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
