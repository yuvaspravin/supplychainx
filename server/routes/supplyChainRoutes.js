const express = require("express");
const router = express.Router();
const supplyChainController = require("../controllers/supplyChainController");

// Fallback check to prevent uncaught runtime crashes
if (
  !supplyChainController.getGraphData ||
  !supplyChainController.getBlastRadius
) {
  console.error(
    "CRITICAL: Controller handlers are undefined! Check supplyChainController.js exports.",
  );
}

router.get("/graph", supplyChainController.getGraphData);
router.get("/blast-radius/:companyId", supplyChainController.getBlastRadius);

module.exports = router;
