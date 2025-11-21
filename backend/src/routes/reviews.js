// backend/src/routes/reviews.js
const express = require("express");
const router = express.Router();
const reviewCtrl = require("../controllers/reviewController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// create/update review
router.post(
  "/stores/:storeId/reviews",
  authMiddleware,
  reviewCtrl.upsertReview
);

// update review by id
router.put("/reviews/:id", authMiddleware, reviewCtrl.updateReview);

// delete review by id
router.delete("/reviews/:id", authMiddleware, reviewCtrl.deleteReview);

module.exports = router;
