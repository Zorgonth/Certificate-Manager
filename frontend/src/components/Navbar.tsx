import React, { useState } from "react";
import {JSX} from "react";
import "./Navbar.css";

type NavbarProps = {
  setActivePage: React.Dispatch<React.SetStateAction<"home" | "create" | "view">>;
};

const Navbar = ({ setActivePage }: NavbarProps): JSX.Element => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = window.innerWidth <= 768;
  const shouldShowLinks = !isMobile || menuOpen;

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="your-logo.png" alt="Logo" />
      </div>

      <div className="hamburger" onClick={(): void => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <div className={`navbar-links ${shouldShowLinks ? "active" : ""}`}>
        <button onClick={(): void => setActivePage("view")}>View</button>
        <button onClick={(): void => setActivePage("create")}>Create</button>
        <button onClick={(): void => setActivePage("home")}>Home</button>
      </div>
    </nav>
  );
};

export default Navbar;
