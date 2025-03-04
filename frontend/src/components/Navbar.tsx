import React, { useState } from "react";
import "./Navbar.css";

type NavbarProps = {
  setActivePage: React.Dispatch<React.SetStateAction<"home" | "create" | "view">>;
};

const Navbar: React.FC<NavbarProps> = ({ setActivePage }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="your-logo.png" alt="Logo" />
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <button onClick={() => setActivePage("view")}>View</button>
        <button onClick={() => setActivePage("create")}>Create</button>
        <button onClick={() => setActivePage("home")}>Home</button>
      </div>
    </nav>
  );
};

export default Navbar;
