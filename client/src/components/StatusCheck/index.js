import React, { useState } from "react";
import axios from "axios";
import "./index.css";

function StatusCheck() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkStatus = async () => {
    if (!orderId) return;

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://edviron-api-sepia.vercel.app/check-status/${orderId}`
      );
      setStatus(response.data);
    } catch (error) {
      setError("Transaction not found or error occurred");
      setStatus(null);
    }
    setLoading(false);
  };

  return (
    <div className="status-check">
      <h1>Check Transaction Status</h1>

      <div className="search-section">
        <input
          type="text"
          placeholder="Enter Custom Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="search-input-status"
        />
        <button type="button" onClick={checkStatus} className="search-button">
          Check Status
        </button>
      </div>

      {loading && <div className="loader">Loading...</div>}

      {error && <div className="error-message">{error}</div>}

      {status && !error && (
        <div className="status-result">
          <h1>Transaction Details</h1>
          <div className="status-details">
            <div className="detail-item">
              <span className="label">Status:</span>
              <span className={`status-badge ${status.status.toLowerCase()}`}>
                {status.status}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Collect ID:</span>
              <span>{status.transaction_details.collect_id}</span>
            </div>
            <div className="detail-item">
              <span className="label">Gateway:</span>
              <span>{status.transaction_details.gateway}</span>
            </div>
            <div className="detail-item">
              <span className="label">Order Amount:</span>
              <span>₹{status.transaction_details.order_amount}</span>
            </div>
            <div className="detail-item">
              <span className="label">Transaction Amount:</span>
              <span>₹{status.transaction_details.transaction_amount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusCheck;
