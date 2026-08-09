const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// All user management routes are admin-only
router.use(verifyToken, isAdmin);

router.route("/").get(getUsers);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
