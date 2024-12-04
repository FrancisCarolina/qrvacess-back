const express = require("express");
const router = express.Router();
const qrcodeController = require("../controllers/qrcodeController");

router.put("/qrcode", qrcodeController.validarQrcode);
router.get("/qrcode/:id", qrcodeController.buscarQrcode);

module.exports = router;
