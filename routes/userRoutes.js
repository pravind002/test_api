const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

router.get("/", UserController.getAllUsers);
router.post("/register", UserController.createUser);
router.put("/:id", UserController.updateUser);

module.exports = router;
