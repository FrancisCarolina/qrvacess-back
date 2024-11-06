const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.put("/condutor/ativar", userController.ativarCondutor);

module.exports = router;