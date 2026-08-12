const express = require("express");
const router = express.Router();
const supplyChainController = require("../controllers/supplyChainController");

// Graph visualization data endpoint
router.get("/graph", supplyChainController.getGraphData);

// Multi-hop traversal endpoint
router.get("/blast-radius/:companyId", supplyChainController.getBlastRadius);

module.exports = router;
