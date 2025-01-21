
const express = require("express");
const router = express.Router();
const historicoController = require("../controllers/historicoController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/historico/local/:id", authMiddleware.verifyToken, historicoController.getHistoricoPorLocal);


module.exports = router;
