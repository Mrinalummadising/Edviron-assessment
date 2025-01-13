const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const dbConnection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://test-user:edviron@edvironassessment.ub8p5.mongodb.net/?retryWrites=true&w=majority&appName=edvironAssessment"
    );
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = dbConnection;
