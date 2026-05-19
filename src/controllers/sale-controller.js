import Client from "../models/client-model.js";
import Transaction from "../models/transaction-model.js";
import Product from "../models/product-model.js";

const controller = {

  realizarVenda: async (req, res) => {

    try {

      const { codigo, itens } = req.body;

      const client = await Client.findOne({ codigo });

      if (!client) {
        return res.status(404).json({
          message: "Cliente não encontrado"
        });
      }

      let total = 0;

      for (const item of itens) {

        const produto = await Product.findById(item._id);

        if (!produto) {
          return res.status(404).json({
            message: `Produto não encontrado`
          });
        }

        if (produto.quantidade < item.quantidade) {
          return res.status(400).json({
            message: `${produto.nome} sem estoque suficiente`
          });
        }

        total += produto.preco * item.quantidade;
      }

      if (client.saldo < total) {
        return res.status(400).json({
          message: "Saldo insuficiente"
        });
      }

      client.saldo -= total;
      await client.save();

      for (const item of itens) {

        const produto = await Product.findById(item._id);

        produto.quantidade -= item.quantidade;
        await produto.save();
      }

      await Transaction.create({
        clienteId: client._id,
        tipo: "DEBITO",
        valor: total,
        descricao: `Compra com ${itens.length} itens`
      });

      res.json({
        message: "Compra realizada com sucesso",
        saldoAtual: client.saldo
      });

    } catch (error) {

      res.status(500).json({
        message: "Erro ao realizar venda",
        error: error.message
      });

    }

  }

};

export default controller;  