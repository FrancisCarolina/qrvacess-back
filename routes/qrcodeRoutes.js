const express = require("express");
const router = express.Router();
const qrcodeController = require("../controllers/qrcodeController");

router.put("/qrcode", qrcodeController.validarQrcode);

module.exports = router;
