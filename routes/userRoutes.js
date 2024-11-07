// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rota para cadastro de usuário como admin
router.post("/admin", userController.register);
router.post("/condutor", userController.registerCondutor);
router.get("/usuario/:id", authMiddleware.verifyToken, userController.getUsuarioById);

module.exports = router;
