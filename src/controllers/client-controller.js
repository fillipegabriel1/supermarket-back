import Client from "../models/client-model.js";
import Transaction from "../models/transaction-model.js";

const controller = {

    create: async (req, res) => {
        try {

            const { codigo, nome } = req.body;

            if (!codigo || !nome) {
                return res.status(400).json({
                    message: "Código e nome são obrigatórios"
                });
            }

            const exist = await Client.findOne({ codigo });

            if (exist) {
                return res.status(400).json({
                    message: "Cliente já existe"
                });
            }

            const client = await Client.create({
                codigo,
                nome,
                saldo: 0
            });

            res.status(201).json(client);

        } catch (error) {

            res.status(500).json({
                message: "Erro ao criar cliente",
                error: error.message
            });

        }
    },

    getByCodigo: async (req, res) => {

        try {

            const codigo = Number(req.params.codigo);

            const client = await Client.findOne({ codigo });

            if (!client) {
                return res.status(404).json({
                    message: "Cliente não encontrado"
                });
            }

            res.status(200).json(client);

        } catch (error) {

            res.status(500).json({
                message: "Erro ao buscar cliente",
                error: error.message
            });

        }

    },

    recharge: async (req, res) => {

        try {

            const codigo = Number(req.params.codigo);
            const valor = Number(req.body.valor);

            if (!valor || valor <= 0) {
                return res.status(400).json({
                    message: "Valor inválido para recarga"
                });
            }

            const client = await Client.findOneAndUpdate(
                { codigo },
                { $inc: { saldo: valor } },
                { new: true }
            );

            if (!client) {
                return res.status(404).json({
                    message: "Cliente não encontrado"
                });
            }

            await Transaction.create({
                clienteId: client._id,
                tipo: "RECARGA",
                valor
            });

            res.status(200).json({
                message: "Saldo recarregado",
                saldoAtual: client.saldo
            });

        } catch (error) {

            res.status(500).json({
                message: "Erro ao recarregar saldo",
                error: error.message
            });

        }

    },

    debit: async (req, res) => {

        try {

            const codigo = Number(req.params.codigo);
            const valor = Number(req.body.valor);

            if (!valor || valor <= 0) {
                return res.status(400).json({
                    message: "Valor inválido para débito"
                });
            }

            const client = await Client.findOneAndUpdate(
                {
                    codigo,
                    saldo: { $gte: valor }
                },
                {
                    $inc: { saldo: -valor }
                },
                {
                    new: true
                }
            );

            if (!client) {
                return res.status(400).json({
                    message: "Saldo insuficiente ou cliente não encontrado"
                });
            }

            await Transaction.create({
                clienteId: client._id,
                tipo: "DEBITO",
                valor
            });

            res.status(200).json({
                message: "Saldo debitado",
                saldoAtual: client.saldo
            });

        } catch (error) {

            res.status(500).json({
                message: "Erro ao debitar saldo",
                error: error.message
            });

        }

    },

    getHistory: async (req, res) => {

        try {

            const codigo = Number(req.params.codigo);

            const client = await Client.findOne({ codigo });

            if (!client) {
                return res.status(404).json({
                    message: "Cliente não encontrado"
                });
            }

            const transactions = await Transaction
                .find({ clienteId: client._id })
                .sort({ data: -1 });

            res.status(200).json(transactions);

        } catch (error) {

            res.status(500).json({
                message: "Erro ao buscar histórico",
                error: error.message
            });

        }

    }

};

export default controller;