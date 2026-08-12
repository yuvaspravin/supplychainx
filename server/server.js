const express = require("express");
const cors = require("cors");
require("dotenv").config();

const supplyChainRoutes = require("./routes/supplyChainRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", supplyChainRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// Start Express Listener
app.listen(PORT, () => {
  console.log(`🚀 SupplyChainX Server running on port ${PORT}`);
});
