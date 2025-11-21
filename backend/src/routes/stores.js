// backend/src/routes/stores.js
const express = require("express");
const router = express.Router();
const storeCtrl = require("../controllers/storeController");
const {
  authMiddleware,
  requireRole,
} = require("../middlewares/authMiddleware");

router.get("/", storeCtrl.listStores);
router.get("/:id", storeCtrl.getStore);

// admin only
router.post("/", authMiddleware, requireRole(["ADMIN"]), storeCtrl.createStore);

module.exports = router;
