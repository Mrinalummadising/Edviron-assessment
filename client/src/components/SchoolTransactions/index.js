import React, { useState } from "react";
import axios from "axios";
import "./index.css";

function SchoolTransactions() {
  const [schoolId, setSchoolId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSchoolTransactions = async () => {
    if (!schoolId) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://edviron-api-sepia.vercel.app/transactions/school/${schoolId}`
      );
      setTransactions(response.data);
      //console.log(response.data)
    } catch (error) {
      console.error("Error school:", error);
    }
    setLoading(false);
  };

  return (
    <div className="school-transactions">
      <h1>School Transactions</h1>

      <div className="search-section">
        <input
          type="text"
          className="school-input"
          placeholder="Enter School ID"
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
        />
        <button
          type="button"
          onClick={fetchSchoolTransactions}
          className="search-button"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : transactions.length > 0 ? (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Collect ID</th>
              <th>Gateway</th>
              <th>Order Amount</th>
              <th>Transaction Amount</th>
              <th>Status</th>
              <th>Custom Order ID</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.collect_id}>
                <td>{transaction.collect_id}</td>
                <td>{transaction.gateway}</td>
                <td>₹{transaction.order_amount}</td>
                <td>₹{transaction.transaction_amount}</td>
                <td>
                  <span
                    className={`status-badge ${transaction.status.toLowerCase()}`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td>{transaction.custom_order_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-data">No transactions found for this school.</p>
      )}
    </div>
  );
}
export default SchoolTransactions;
