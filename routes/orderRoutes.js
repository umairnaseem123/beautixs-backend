const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updateOrderToPaid,
  getDashboardStats,
} = require("../controllers/orderController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Admin dashboard stats - defined before /:id to avoid route collision
router.get("/dashboard/stats", verifyToken, isAdmin, getDashboardStats);

router.get("/myorders", verifyToken, getMyOrders);

router
  .route("/")
  .post(verifyToken, createOrder)
  .get(verifyToken, isAdmin, getAllOrders);

router.get("/:id", verifyToken, getOrderById);
router.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);
router.put("/:id/pay", verifyToken, updateOrderToPaid);

module.exports = router;
