import React from "react";

const Header = () => {
  return (
    <header className="Header bg-black text-white">
      <h1>Welcome to Our Hair Salon</h1>
      <nav>
        <ul className="nav justify-content-center">
          <li className="nav-item">
            <a className="nav-link text-white" href="/">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="/services">
              Services
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="/about">
              About Us
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="/contact">
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
