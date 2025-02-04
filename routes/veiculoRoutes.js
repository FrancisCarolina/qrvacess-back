const express = require('express');
const router = express.Router();
const veiculoController = require('../controllers/veiculoController');
const authMiddleware = require("../middlewares/authMiddleware");

router.post('/veiculo', authMiddleware.verifyToken, veiculoController.createVeiculo);
router.get('/busca/veiculo/local/:local_id', authMiddleware.verifyToken, veiculoController.getVeiculoByPlacaOuNome);
router.get('/veiculo/condutor/:id', authMiddleware.verifyToken, veiculoController.getVeiculosByCondutorId);
router.get('/veiculo/local/:local_id',authMiddleware.verifyToken, veiculoController.getVeiculosByLocal)
router.put("/veiculos/:id",authMiddleware.verifyToken, veiculoController.updateVeiculo);
router.get("/veiculos/:id",authMiddleware.verifyToken, veiculoController.getVeiculosById);
router.delete("/:id",authMiddleware.verifyToken, veiculoController.deleteVeiculo);

module.exports = router;
