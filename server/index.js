const express = require('express');
const router = require('./routes/index');
const configDB = require('./dbconfig');
const dotenv = require('dotenv');
const cors = require("cors");
dotenv.config();
configDB();


const server = express();
const PORT = 8001;

server.use(cors());
server.use(express.json({ limit: "50mb" }));
server.use(express.urlencoded({ limit: "50mb", extended: true }));

server.use('/url', router);

server.listen(PORT ,() => {
    console.log("Server is listening on port 8001");
})