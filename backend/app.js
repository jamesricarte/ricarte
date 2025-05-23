const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const postRoutes = require("./routes/postRoutes")
const userRoutes = require("./routes/user")

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
})
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);  

module.exports = app;