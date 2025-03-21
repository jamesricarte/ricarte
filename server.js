const app = require("./backend/app");
const connectDb = require('./backend/config/db');

connectDb();

app.listen(3000, () => {
    console.log("Server is running at port: 3000");
})