import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import SchoolTransactions from "./components/SchoolTransactions";
import StatusCheck from "./components/StatusCheck";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route
                path="/school-transactions"
                element={<SchoolTransactions />}
              />
              <Route path="/status-check" element={<StatusCheck />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
