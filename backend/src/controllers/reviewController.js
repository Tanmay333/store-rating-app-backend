// backend/src/controllers/reviewController.js
const prisma = require("../prismaClient");

/**
 * POST /api/stores/:storeId/reviews
 * User can create or update one review per store
 */
exports.upsertReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = Number(req.params.storeId);
    const { rating, comment } = req.body;

    if (!storeId) return res.status(400).json({ error: "Invalid store ID" });

    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ error: "Rating must be 1-5" });

    const review = await prisma.review.upsert({
      where: {
        userId_storeId: { userId, storeId },
      },
      update: {
        rating,
        comment,
      },
      create: {
        userId,
        storeId,
        rating,
        comment,
      },
    });

    res.status(201).json({ review });
  } catch (err) {
    console.error("UPSERT REVIEW ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * PUT /api/reviews/:id (author only)
 */
exports.updateReview = async (req, res) => {
  try {
    const reviewId = Number(req.params.id);
    const { rating, comment } = req.body;

    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) return res.status(404).json({ error: "Review not found" });

    if (review.userId !== req.user.id)
      return res.status(403).json({ error: "Forbidden" });

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { rating, comment },
    });

    res.json({ review: updated });
  } catch (err) {
    console.error("UPDATE REVIEW ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * DELETE /api/reviews/:id (author OR admin)
 */
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = Number(req.params.id);

    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) return res.status(404).json({ error: "Review not found" });

    const isOwner = review.userId === req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    if (!isOwner && !isAdmin)
      return res.status(403).json({ error: "Forbidden" });

    await prisma.review.delete({ where: { id: reviewId } });

    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error("DELETE REVIEW ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};
