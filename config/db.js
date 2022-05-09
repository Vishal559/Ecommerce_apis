const mongoose = require("mongoose");

const connectWithDb = () => {
  mongoose
    .connect("mongodb://localhost:27017/ECOM_DB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("CONNECTED WITH DATABASE"))
    .catch((error) => {
      console.log("DATABASE CONNECTION ISSUES");
      console.log(error);
      process.exit(1);
    });
};

module.exports = connectWithDb;