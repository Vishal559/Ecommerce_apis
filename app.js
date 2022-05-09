const express = require("express");
require("dotenv").config();
const app = express();
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");


//regular middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
);

//import All routes
const user = require("./routes/user");
const product = require("./routes/product");
const order = require("./routes/order");

//router middleware
app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1",order);


module.exports = app;

