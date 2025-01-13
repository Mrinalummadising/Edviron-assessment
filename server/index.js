const mongoose = require("mongoose");
const express = require("express");
const mongoDb = require("./database/db");
const {
  CollectRequest,
  CollectRequestStatus,
} = require("./models/Transaction");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

mongoDb();

app.get("/transactions", async (req, res) => {
  try {
    const collectRequests = await CollectRequest.find();
    const transactions = await Promise.all(
      collectRequests.map(async (request) => {
        const status = await CollectRequestStatus.findOne({
          collect_id: request._id.toString(),
        });
        return {
          collect_id: request._id,
          school_id: request.school_id,
          gateway: request.gateway,
          order_amount: request.order_amount,
          transaction_amount: status?.transaction_amount || 0,
          status: status?.status || "PENDING",
          custom_order_id: request.custom_order_id,
        };
      })
    );

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

///
app.get("/transactions/school/:schoolId", async (req, res) => {
  try {
    const { schoolId } = req.params;
    const collectRequests = await CollectRequest.find({ school_id: schoolId });
    const transactions = await Promise.all(
      collectRequests.map(async (request) => {
        const status = await CollectRequestStatus.findOne({
          collect_id: request._id.toString(),
        });
        return {
          collect_id: request._id,
          school_id: request.school_id,
          gateway: request.gateway,
          order_amount: request.order_amount,
          transaction_amount: status?.transaction_amount || 0,
          status: status?.status || "PENDING",
          custom_order_id: request.custom_order_id,
        };
      })
    );
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/check-status/:customOrderId", async (req, res) => {
  try {
    const { customOrderId } = req.params;
    const request = await CollectRequest.findOne({
      custom_order_id: customOrderId,
    });
    if (!request) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    const status = await CollectRequestStatus.findOne({
      collect_id: request._id.toString(),
    });
    res.json({
      status: status?.status || "PENDING",
      transaction_details: {
        collect_id: request._id,
        gateway: request.gateway,
        order_amount: request.order_amount,
        transaction_amount: status?.transaction_amount || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//////
app.post("/api/webhook/status-update", async (req, res) => {
  try {
    const { status, order_info } = req.body;
    const {
      order_id,
      order_amount,
      payment_method = "N/A",
      transaction_amount,
      gateway,
      bank_reference,
    } = order_info;

    const webhookStatus = await CollectRequestStatus.findOneAndUpdate(
      { collect_id: order_id },
      {
        status: status,
        gateway,
        payment_method,
        transaction_amount,
        order_amount,
        bank_reference,
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, webhookStatus });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`server connected successfully at ${PORT}`);
});
