import Product from "../models/product-model.js";

const controller = {

  create: async (req, res) => {

    try {

      const {
        nome,
        preco,
        quantidade,
        categoria
      } = req.body;

      if (
        !nome ||
        preco == null ||
        quantidade == null
      ) {

        return res.status(400).json({
          message:
            "Nome, preço e quantidade são obrigatórios"
        });

      }

      const product = await Product.create({
        nome,
        preco: Number(preco),
        quantidade: Number(quantidade),
        categoria: categoria || "ALIMENTO"
      });

      res.status(201).json(product);

    } catch (error) {

      res.status(500).json({
        message: "Erro ao criar produto",
        error: error.message
      });

    }
  },

  /* =========================
     LISTAR PRODUTOS
  ========================= */
  getAll: async (req, res) => {

    try {

      console.log(
        "🔥 SUPERMARKET API CHAMADA"
      );

      // 🚨 TESTE TEMPORÁRIO
      // TROQUEI O FIND POR ARRAY VAZIO

      const products = [];

      res.json(products);

    } catch (error) {

      res.status(500).json({
        message: "Erro ao buscar produtos",
        error: error.message
      });

    }
  },

  getOne: async (req, res) => {

    try {

      const product =
        await Product.findById(req.params.id);

      if (!product) {

        return res.status(404).json({
          message: "Produto não encontrado"
        });

      }

      res.json(product);

    } catch (error) {

      res.status(500).json({
        message: "Erro ao buscar produto",
        error: error.message
      });

    }
  },

  updateOne: async (req, res) => {

    try {

      const {
        nome,
        preco,
        quantidade,
        categoria
      } = req.body;

      const updateData = {};

      if (nome !== undefined)
        updateData.nome = nome;

      if (preco !== undefined)
        updateData.preco = Number(preco);

      if (quantidade !== undefined)
        updateData.quantidade =
          Number(quantidade);

      if (categoria !== undefined)
        updateData.categoria = categoria;

      const updated =
        await Product.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
        );

      if (!updated) {

        return res.status(404).json({
          message: "Produto não encontrado"
        });

      }

      res.json(updated);

    } catch (error) {

      res.status(500).json({
        message: "Erro ao atualizar",
        error: error.message
      });

    }
  },

  deleteOne: async (req, res) => {

    try {

      const deleted =
        await Product.findByIdAndDelete(
          req.params.id
        );

      if (!deleted) {

        return res.status(404).json({
          message: "Produto não encontrado"
        });

      }

      res.json({
        message: "Produto deletado"
      });

    } catch (error) {

      res.status(500).json({
        message: "Erro ao deletar",
        error: error.message
      });

    }
  }

};

export default controller;