import express from 'express';
import userController from '../controllers/user-controller.js';

const router = express.Router();

router.post('/login', userController.login);

router.post('/register', userController.create);

router
  .route('/:id')
  .get(userController.getOne)
  .put(userController.updateOne)
  .delete(userController.deleteOne);

router
  .route('/')
  .get(userController.getAll);

export default router;