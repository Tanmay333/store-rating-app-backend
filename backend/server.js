// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// require route modules FIRST
const authRoutes = require("./src/routes/auth");
const storeRoutes = require("./src/routes/stores");
const reviewRoutes = require("./src/routes/reviews");

// health
app.get("/health", (req, res) => res.json({ ok: true, timestamp: Date.now() }));

// mount routes (after requires)
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api", reviewRoutes);


