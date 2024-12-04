const express = require('express');
const router = express.Router();
const  qrcodeValido  = require('../models/qrcodeValido'); // Substitua pelo caminho correto do modelo

// PUT /qrcode - Atualizar ou criar o registro com id = 1
exports.validarQrcode =  async (req, res) => {
  try {
    const { valido } = req.body;

    // Validar entrada
    if (typeof valido !== 'boolean') {
      return res.status(400).json({ error: 'O campo "valido" deve ser um booleano (true ou false).' });
    }

    // Buscar o registro com id = 1
    let qrcode = await qrcodeValido.findByPk(1);

    if (!qrcode) {
      // Criar o registro com id = 1 e valido = 0, caso não exista
      qrcode = await qrcodeValido.create({
        id: 1,
        valido: false, // Cria com válido como falso inicialmente
      });
    }

    // Atualizar o valor de "valido"
    qrcode.valido = valido;
    await qrcode.save();

    return res.status(200).json({ message: 'QR Code atualizado com sucesso.', qrcode });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

