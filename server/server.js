const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { verifyConnection } = require("./config/database");
const supplyChainRoutes = require("./routes/supplyChainRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", supplyChainRoutes);

// Health check endpoint with database status
app.get("/health", async (req, res) => {
  const isConnected = await verifyConnection();
  if (isConnected) {
    res.status(200).json({ status: "UP", database: "CognoDB Connected" });
  } else {
    res.status(503).json({ status: "DOWN", database: "Unreachable" });
  }
});

// Start Server
app.listen(PORT, async () => {
  console.log(`SupplyChainX Server running on port ${PORT}`);
  await verifyConnection();
});
