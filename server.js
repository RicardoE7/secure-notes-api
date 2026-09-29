const express = require("express");
require("dotenv").config();

const connectDB = require("./config/connection");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTES
app.use(routes);

// DATABASE + SERVER
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Secure Notes API running at http://localhost:${PORT}`);
  });
}

startServer();
