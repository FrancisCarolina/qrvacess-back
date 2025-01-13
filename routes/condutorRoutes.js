// routes/condutorRoutes.js
const express = require("express");
const router = express.Router();
const condutorController = require("../controllers/condutorController");
const authMiddleware = require("../middlewares/authMiddleware");

router.put("/condutor/ativar", authMiddleware.verifyToken, condutorController.ativarCondutor);
router.get("/condutor/local/:id", authMiddleware.verifyToken, condutorController.getCondutoresByLocalId);
router.get("/condutor/user/:id", authMiddleware.verifyToken, condutorController.getCondutorByUserId);
router.put("/condutor/:id", authMiddleware.verifyToken, condutorController.updateCondutor);


module.exports = router;
