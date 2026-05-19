import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import userRouter from './src/routers/user-router.js';
import productRouter from './src/routers/product-router.js';
import clientRouter from './src/routers/client-router.js';
import dashboardRouter from './src/routers/dashboard-router.js';
import saleRouter from './src/routers/sale-router.js';
import authMiddleware from './src/services/auth-middleware.js';

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('✅ Banco conectado com sucesso');
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar no banco:', err);
  });

app.use(express.json());

app.use(cors({
  origin: "*"
}));

app.get('/', (req, res) => {
  res.json({ status: "API Supermarket funcionando 🚀" });
});

app.use('/api/user', userRouter);

app.use(authMiddleware);

app.use('/api/product', productRouter);
app.use('/api/client', clientRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/sale', saleRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});