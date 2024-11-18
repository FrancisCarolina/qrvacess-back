const express = require("express");
const router = express.Router();
const codigoController = require("../controllers/codigoController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/codigo/validar",authMiddleware.verifyToken, codigoController.validarCodigo);
router.post('/condutor/:id/codigo',authMiddleware.verifyToken, codigoController.gerarCodigo);

module.exports = router;
