const mongoose = require("mongoose");

const configDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB not connected", error);
    process.exit(1);
  }
};

module.exports = configDB;