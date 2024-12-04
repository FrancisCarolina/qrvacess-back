const express = require('express');
const router = express.Router();
const  qrcodeValido  = require('../models/qrcodeValido'); // Substitua pelo caminho correto do modelo

// PUT /qrcode - Atualizar ou criar o registro com id = 1
exports.validarQrcode =  async (req, res) => {
  try {
    const { valido } = req.body;


    // Buscar o registro com id = 1
    let qrcode = await qrcodeValido.findByPk(1);

    if (!qrcode) {
      qrcode = await qrcodeValido.create({
        id: 1,
        valido: 0, 
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

exports.buscarQrcode = async (req, res) => {
    try {
      const { id } = req.params; // Pega o id da URL
  
      // Buscar o QR Code com o id informado
      const qrcode = await qrcodeValido.findByPk(id);
  
      if (!qrcode) {
        return res.status(404).json({ message: 'QR Code não encontrado.' });
      }
  
      return res.status(200).json({ qrcode });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  };