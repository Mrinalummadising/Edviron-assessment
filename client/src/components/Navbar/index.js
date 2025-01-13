import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { FaRegSun, FaRegMoon } from "react-icons/fa";
import "./index.css";

function Navbar() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <nav className="navbar">
      <h1 className="nav-heading">School Payment Dashboard</h1>
      <ul className="nav-links">
        <Link to="/">
          <li>Dashboard</li>
        </Link>
        <Link to="/school-transactions">
          <li>School Transactions</li>
        </Link>
        <Link to="/status-check">
          <li> Status Check</li>
        </Link>
        <button onClick={toggleDarkMode} className="theme-toggle">
          {darkMode ? <FaRegSun /> : <FaRegMoon />}
        </button>
      </ul>
    </nav>
  );
}

export default Navbar;
