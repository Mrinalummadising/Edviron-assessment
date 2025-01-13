const mongoose = require("mongoose");

const collectRequestSchema = new mongoose.Schema({
  school_id: String,
  trustee_id: String,
  gateway: String,
  order_amount: Number,
  custom_order_id: String,
});

const collectRequestStatusSchema = new mongoose.Schema({
  collect_id: String,
  status: String,
  payment_method: String,
  gateway: String,
  transaction_amount: Number,
  bank_refrence: String,
});

const CollectRequest = mongoose.model(
  "CollectRequest",
  collectRequestSchema,
  "collect_request"
);
const CollectRequestStatus = mongoose.model(
  "CollectRequestStatus",
  collectRequestStatusSchema,
  "collect_request_status"
);

module.exports = { CollectRequest, CollectRequestStatus };
