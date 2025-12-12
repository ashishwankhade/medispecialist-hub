import React, { useState, useEffect } from "react";
import axios from "axios";
import * as CryptoJS from "crypto-js";
import "./TransactionTable.css"

const TransactionTable = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDecryption = (data) => {
    const CIPHER = import.meta.env.VITE_ENCRYPTION_CIPHER;
    if (CIPHER) {
      const bytes = CryptoJS.AES.decrypt(data, `${CIPHER}`);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedData;
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      const BASE_URL = import.meta.env.VITE_API_KEY;

      try {
        const response = await axios.get(
          `${BASE_URL}/api/payment-info/payment-information`
        );
        console.log("Working");
        setTransactions(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Error fetching transactions");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    if (transactions) {
      setFilteredTransactions(transactions);
      console.log(transactions);
    }
  }, [transactions]);

  useEffect(() => {
    if (transactions[0])
      console.log(handleDecryption(transactions[0].order_id));
  }, [transactions[0]]);

  useEffect(() => {
    if (transactions) {
      const filtered = transactions.filter((transaction) => {
        if (!startDate && !endDate) return true;

        const transactionDate = new Date(transaction.payment_completion_time);
        const start = startDate ? new Date(startDate) : new Date("1900-01-01");
        const end = endDate ? new Date(endDate) : new Date("2999-12-31");

        transactionDate.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        return transactionDate >= start && transactionDate <= end;
      });

      setFilteredTransactions(filtered);
    }
  }, [startDate, endDate, transactions]);

  const downloadCSV = () => {
    const headers = [
      "Card Number",
      "Card Type",
      "Card Network",
      "Card Country",
      "Gateway Order ID",
      "Gateway Payment ID",
      "Gateway Name",
      "Payment Status",
      "Order ID",
      "Payment Amount",
      "Payment Completion Time",
      "Client Name",
      "Client Email",
      "Client Phone",
      "Payment Group",
    ];

    const rows = transactions.map((transaction) => [
      transaction.card_number,
      transaction.card_type,
      transaction.card_network,
      transaction.card_country,
      handleDecryption(transaction.gateway_order_id),
      handleDecryption(transaction.gateway_payment_id),
      transaction.gateway_name,
      transaction.payment_status,
      handleDecryption(transaction.order_id),
      `Rs. ${transaction.payment_amount.toFixed(2)}`,
      new Date(transaction.payment_completion_time).toLocaleDateString(),
      transaction.client_name,
      transaction.client_email,
      transaction.client_phone,
      transaction.payment_group,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `transactions_${new Date().toLocaleDateString()}.csv`
    );
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    try {
      let tableHtml = `
        <html>
          <head>
            <style>
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f8f9fa;
                font-weight: bold;
              }
              tr:nth-child(even) {
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>
            <table>
              <thead>
                <tr>
      `;

      const headers = Object.keys(filteredTransactions[0]);
      headers.forEach((header) => {
        tableHtml += `<th>${
          header.charAt(0).toUpperCase() + header.slice(1)
        }</th>`;
      });

      tableHtml += `
                </tr>
              </thead>
              <tbody>
      `;

      filteredTransactions.forEach((row) => {
        tableHtml += "<tr>";
        headers.forEach((header) => {
          tableHtml += `<td>${row[header]}</td>`;
        });
        tableHtml += "</tr>";
      });

      tableHtml += `
              </tbody>
            </table>
          </body>
        </html>
      `;

      const printWindow = window.open("", "_blank");
      printWindow.document.write(tableHtml);
      printWindow.document.close();
      printWindow.print();

      setLoading(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setLoading(false);
    }
  };

  return (
    <div className="transactionTable-container">
      <div className="transactionTable-card">
        <div className="transactionTable-cardHeader">
          <div className="transactionTable-cardTitle">
            <span>Transaction History</span>
          </div>
        </div>
        <div className="transactionTable-controls">
              <div className="transactionTable-datePicker">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="transactionTable-input"
                  placeholder="Start Date"
                />
              </div>
              <div className="transactionTable-datePicker">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="transactionTable-input"
                  placeholder="End Date"
                />
              </div>
              <button
                onClick={downloadCSV}
                className="transactionTable-button transactionTable-buttonBlue"
              >
                Export CSV
              </button>
              <button
                onClick={downloadPdf}
                className="transactionTable-button transactionTable-buttonRed"
              >
                Export PDF
              </button>
            </div>
        <div className="transactionTable-cardContent">
          <div className="transactionTable-tableContainer">
            <table className="transactionTable-table">
              <thead>
                <tr className="transactionTable-tableRow">
                  <th className="transactionTable-tableHeader">Order ID</th>
                  <th className="transactionTable-tableHeader">Card Number</th>
                  <th className="transactionTable-tableHeader">Card Type</th>
                  <th className="transactionTable-tableHeader">Card Network</th>
                  <th className="transactionTable-tableHeader">Card Country</th>
                  <th className="transactionTable-tableHeader">
                    Gateway Order ID
                  </th>
                  <th className="transactionTable-tableHeader">
                    Gateway Payment ID
                  </th>
                  <th className="transactionTable-tableHeader">Gateway Name</th>
                  <th className="transactionTable-tableHeader">
                    Payment Status
                  </th>
                  <th className="transactionTable-tableHeader">
                    Payment Amount
                  </th>
                  <th className="transactionTable-tableHeader">
                    Payment Completion Time
                  </th>
                  <th className="transactionTable-tableHeader">Client Name</th>
                  <th className="transactionTable-tableHeader">Client Email</th>
                  <th className="transactionTable-tableHeader">Client Phone</th>
                  <th className="transactionTable-tableHeader">
                    Payment Group
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.order_id}
                    className="transactionTable-tableRow"
                  >
                    <td className="transactionTable-tableData">
                      {handleDecryption(transaction.order_id)}
                    </td>
                    <td className="transactionTable-tableData">
                      {transaction.card_number}
                    </td>
                    <td className="transactionTable-tableData">
                      {transaction.card_type}
                    </td>
                    <td className="transactionTable-tableData">
                      {transaction.card_network}
                    </td>
                    <td className="transactionTable-tableData">
                      {transaction.card_country}
                    </td>
                    <td className="transactionTable-tableData">
                      {handleDecryption(transaction.gateway_order_id)}
                    </td>
                    <td className="transactionTable-tableData">
                      {handleDecryption(transaction.gateway_payment_id)}
                    </td>
                    <td className="transactionTable-tableData">
                      {transaction.gateway_name}
                    </td>
                    <td className="transactionTable-tableData">
                      {transaction.payment_status}
                    </td>
                    <td className="transactionTable-tableData">
                      Rs. {transaction.payment_amount.toFixed(2)}
                    </td>
                    <td className="transactionTable-tableData">
                      {new Date(
                        transaction.payment_completion_time
                      ).toLocaleDateString()}
                    </td>
                    <td className="transactionTable-tableData">
                      {transaction.client_name}
                    </td>
                    <td className="transactionTable-tableData">
                      {transaction.client_email}
                    </td>
                    <td className="transactionTable-tableData">
                      {transaction.client_phone}
                    </td>
                    <td className="transactionTable-tableData">
                      {transaction.payment_group}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
