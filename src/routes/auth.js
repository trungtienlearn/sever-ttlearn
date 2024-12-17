const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRole } = require("../middleware/auth");

//Controller:
const UserController = require("../controllers/UserController");

router.get("/users", authenticateToken, authorizeRole(["admin"]), UserController.showAllUser);
router.get("/me", authenticateToken, UserController.me);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/refresh", UserController.refresh);
router.get("/accounts", authenticateToken, UserController.myAccount);

module.exports = router;
