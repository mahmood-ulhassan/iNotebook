const mongoose = require("mongoose");

async function connectToMongodb() {
  mongoose
    .connect("mongodb://localhost:27017/inotebook", {})
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
}

module.exports = connectToMongodb;
