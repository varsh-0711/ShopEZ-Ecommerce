const express = require("express");
const router = express.Router();
const {
  getOverview,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUserRole,
  toggleUserActive,
  getAnalytics,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

router.use(protect, adminOnly);

router.get("/overview", getOverview);
router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", updateOrderStatus);
router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.patch("/users/:id/deactivate", toggleUserActive);
router.get("/analytics", getAnalytics);

module.exports = router;
