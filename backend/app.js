const express = require("express");
const cors = require("cors");
const postRoutes = require("../backend/config/postRoutes")

const app = express();
app.use(cors({origin: 'http://127.0.0.1:4200'}))
app.use("/api", postRoutes);

module.exports = app;