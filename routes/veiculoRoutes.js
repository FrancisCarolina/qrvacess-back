const express = require('express');
const router = express.Router();
const veiculoController = require('../controllers/veiculoController');
const authMiddleware = require("../middlewares/authMiddleware");

router.post('/veiculo', authMiddleware.verifyToken, veiculoController.createVeiculo);

module.exports = router;
