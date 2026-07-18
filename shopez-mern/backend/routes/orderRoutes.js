const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  advanceTracking,
  cancelOrder,
} = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/", placeOrder);
router.get("/", getMyOrders);
router.get("/:id", getOrderById);
router.patch("/:id/track", advanceTracking);
router.patch("/:id/cancel", cancelOrder);

module.exports = router;
