const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const authRoutes = require("./auth_routes");

router.use("/", userRoutes);
router.use("/api/auth", authRoutes);

module.exports = router;
