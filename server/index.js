const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const configDB = require("./dbconfig");
const router = require("./routes/index");

dotenv.config();
configDB();

const app = express();
const PORT = process.env.PORT || 8001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/url", router);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
