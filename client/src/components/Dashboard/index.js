import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdOutlineContentCopy } from "react-icons/md";
import "./index.css";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 10;

  // console.log(tempSearchTerm);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://edviron-api-sepia.vercel.app/transactions"
      );
      console.log(response, "frontend");
      setTransactions(response.data);
      setFilteredTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySchoolId = async (schoolId) => {
    try {
      await navigator.clipboard.writeText(schoolId);
      setTimeout(() => alert("school id copied"), 500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  useEffect(() => {
    let filtered = transactions;

    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    if (startDate && endDate) {
      filtered = filtered.filter((t) => {
        const txDate = new Date(t.created_at);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return txDate >= start && txDate <= end;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter((t) =>
        Object.values(t).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [statusFilter, startDate, endDate, searchTerm, transactions]);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = () => {
    setSearchTerm(tempSearchTerm);
    setTempSearchTerm("");
  };

  const searcByDate = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setTempStartDate("");
    setTempEndDate("");
  };

  return (
    <div className="dashboard">
      <h1>Transactions Overview</h1>

      <div className="filters">
        <div className="dashbord-search">
          <input
            type="text"
            placeholder="Search transactions..."
            value={tempSearchTerm}
            onChange={(e) => setTempSearchTerm(e.target.value)}
            className="dashboard-search-input"
          />
          <buttion
            type="button"
            onClick={handleSearch}
            className="search-button-bar"
          >
            search
          </buttion>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Status</option>
          <option value="SUCCESS">Success</option>
          <option value="PENDING">Pending</option>
          <option value="FAILURE">Failure</option>
        </select>

        <div className="date-inputs">
          <input
            type="date"
            value={tempStartDate}
            onChange={(e) => setTempStartDate(e.target.value)}
            className="date-input"
          />
          <input
            type="date"
            value={tempEndDate}
            onChange={(e) => setTempEndDate(e.target.value)}
            className="date-input"
          />
          <buttion
            type="button"
            className="search-button-bar"
            onClick={searcByDate}
          >
            search by date
          </buttion>
        </div>
      </div>
      {isLoading && (
        <div className="Loading-dashboard">
          <p className="loading-text"> Transactions Loading...</p>
        </div>
      )}
      <div className="table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Collect ID</th>
              <th>School ID</th>
              <th>Gateway</th>
              <th>Order Amount</th>
              <th>Transaction Amount</th>
              <th>Status</th>
              <th>Custom Order ID</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((transaction) => (
              <tr className="table-row" key={transaction.collect_id}>
                <td>{transaction.collect_id}</td>
                <td className="copy-column">
                  {transaction.school_id}
                  <button
                    type="button"
                    className="copy-button"
                    onClick={() => handleCopySchoolId(transaction.school_id)}
                    title="Copy School ID"
                  >
                    <MdOutlineContentCopy />
                  </button>
                </td>
                <td>{transaction.gateway}</td>
                <td>₹{transaction.order_amount}</td>
                <td>₹{transaction.transaction_amount}</td>
                <td>
                  <span
                    className={`status-badge ${transaction.status.toLowerCase()}`}
                  >
                    {transaction.status.toLowerCase()}
                  </span>
                </td>
                <td>{transaction.custom_order_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage * itemsPerPage >= filteredTransactions.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
