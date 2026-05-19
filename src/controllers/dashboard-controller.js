import Product from "../models/product-model.js";

const controller = {

  getDashboard: async (req, res) => {

    try {

      // 📦 TOTAL PRODUTOS
      const totalProdutos = await Product.countDocuments();

      // 📦 TOTAL ITENS EM ESTOQUE
      const estoqueTotal = await Product.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$quantidade" }
          }
        }
      ]);

      // 💰 VALOR TOTAL ESTOQUE
      const valorEstoque = await Product.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $multiply: ["$preco", "$quantidade"]
              }
            }
          }
        }
      ]);

      // ⚠️ ESTOQUE BAIXO
      const estoqueBaixo = await Product.countDocuments({
        quantidade: { $lt: 5 }
      });

      // 🗂️ TOTAL CATEGORIAS
      const categorias = await Product.distinct("categoria");

      res.json({
        totalProdutos,
        estoqueTotal: estoqueTotal[0]?.total || 0,
        valorEstoque: valorEstoque[0]?.total || 0,
        estoqueBaixo,
        categorias: categorias.length
      });

    } catch (error) {

      res.status(500).json({
        message: "Erro ao carregar dashboard",
        error: error.message
      });

    }

  }

};

export default controller;