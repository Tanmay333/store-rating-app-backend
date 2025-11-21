// backend/src/controllers/storeController.js
const prisma = require("../prismaClient");

/**
 * GET /api/stores
 */
exports.listStores = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(
      1,
      Math.min(100, parseInt(req.query.limit || "10", 10))
    );
    const search = req.query.search?.trim();

    const where = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    const [total, stores] = await Promise.all([
      prisma.store.count({ where }),
      prisma.store.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const storeIds = stores.map((s) => s.id);

    const aggs = storeIds.length
      ? await prisma.review.groupBy({
          by: ["storeId"],
          where: { storeId: { in: storeIds } },
          _avg: { rating: true },
          _count: { rating: true },
        })
      : [];

    const aggMap = new Map();
    aggs.forEach((a) =>
      aggMap.set(a.storeId, {
        avgRating: a._avg.rating ?? 0,
        ratingsCount: a._count.rating ?? 0,
      })
    );

    const items = stores.map((s) => {
      const a = aggMap.get(s.id) || { avgRating: 0, ratingsCount: 0 };
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        avgRating: Number(a.avgRating),
        ratingsCount: a.ratingsCount,
      };
    });

    res.json({
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
      data: items,
    });
  } catch (err) {
    console.error("LIST STORES ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * GET /api/stores/:id
 */
exports.getStore = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });

    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        reviews: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!store) return res.status(404).json({ error: "Store not found" });

    const agg = await prisma.review.aggregate({
      _avg: { rating: true },
      _count: { rating: true },
      where: { storeId: id },
    });

    const avgRating = Number(agg._avg.rating ?? 0);
    const ratingsCount = agg._count.rating ?? 0;

    res.json({
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      avgRating,
      ratingsCount,
      reviews: store.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        user: r.user,
        createdAt: r.createdAt,
      })),
    });
  } catch (err) {
    console.error("GET STORE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * POST /api/stores  (ADMIN only)
 */
exports.createStore = async (req, res) => {
  try {
    const { name, email, address } = req.body;

    if (!name) return res.status(400).json({ error: "Name required" });
    if (!address) return res.status(400).json({ error: "Address required" });
    if (address.length > 400)
      return res.status(400).json({ error: "Address too long" });

    const store = await prisma.store.create({
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        address: address.trim(),
      },
    });

    res.status(201).json({ store });
  } catch (err) {
    console.error("CREATE STORE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};
