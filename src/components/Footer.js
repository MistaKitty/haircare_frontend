import React from "react";

const Footer = () => {
  return (
    <footer className="Footer bg-black">
      <p className="text-white">
        &copy; {new Date().getFullYear()} Hair Salon. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
