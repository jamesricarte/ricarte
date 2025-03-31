const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const postRoutes = require("./routes/postRoutes")

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
})
app.use("/api/posts", postRoutes);

module.exports = app;