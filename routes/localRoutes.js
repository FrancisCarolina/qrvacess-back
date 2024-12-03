const express = require('express');
const router = express.Router();
const localController = require('../controllers/localController');
const authMiddleware = require("../middlewares/authMiddleware");

// Rota para buscar todos os locais
router.get('/locais', localController.getAllLocais);
router.get('/locais/:id', authMiddleware.verifyToken, localController.getLocalById);

module.exports = router;
