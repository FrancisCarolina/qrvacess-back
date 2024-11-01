// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Rota para cadastro de usuário como admin
router.post("/admin", userController.register);

module.exports = router;
