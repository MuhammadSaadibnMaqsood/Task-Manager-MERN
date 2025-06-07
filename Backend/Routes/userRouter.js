import express, { Router } from 'express'
import { changePassword, currentUser, login, registor, updateUser } from '../Controller/userController.js';
import authMiddleWare from '../middleWare/auth.js';

const userRouter = express.Router();

// public Router

userRouter.post('/registor', registor);
userRouter.post('/login', login);

// private Router

userRouter.get('/me', authMiddleWare, currentUser);
userRouter.put('/password', authMiddleWare, changePassword);
userRouter.put('/profile', authMiddleWare, updateUser);

export default userRouter;