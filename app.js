const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const routerApi = require("./routes/api/index.js");

const app = express();

dotenv.config();

const coreOptions = require("./cors");
app.use(cors(coreOptions));
app.use(morgan("tiny"));
app.use(express.json());

app.use("/api", routerApi);

app.use((_, res, __) => {
  res.status(400).json({
    status: "error",
    code: 404,
    message: "The requested route is not available",
    data: "Not found!",
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: "fail",
    code: 500,
    message: err.message,
    data: "Internal Server error!",
  });
});

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Database connection error. Error:${err.message}`);
    process.exit(1);
  });
