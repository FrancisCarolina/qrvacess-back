// routes/condutorRoutes.js
const express = require("express");
const router = express.Router();
const condutorController = require("../controllers/condutorController");
const authMiddleware = require("../middlewares/authMiddleware");

router.put("/condutor/ativar", authMiddleware.verifyToken, condutorController.ativarCondutor);
router.get("/condutor/local/:id", authMiddleware.verifyToken, condutorController.getCondutoresByLocalId);
router.post('/condutor/:id/codigo',authMiddleware.verifyToken, condutorController.gerarCodigo);

module.exports = router;
