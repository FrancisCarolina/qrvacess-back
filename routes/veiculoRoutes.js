const express = require('express');
const router = express.Router();
const veiculoController = require('../controllers/veiculoController');
const authMiddleware = require("../middlewares/authMiddleware");

router.post('/veiculo', authMiddleware.verifyToken, veiculoController.createVeiculo);
router.get('/veiculo', authMiddleware.verifyToken, veiculoController.getVeiculoByPlacaOuNome);
router.get('/veiculo/condutor/:id', authMiddleware.verifyToken, veiculoController.getVeiculosByCondutorId)

module.exports = router;
