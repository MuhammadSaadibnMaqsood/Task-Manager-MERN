import express, { Router } from 'express'
import authMiddleWare from '../middleWare/auth.js';
import { createTask, delectTask, getTask, getTaskById, updateTask } from '../Controller/taskController.js';

const taskRouter = express.Router();

taskRouter.route('/gp').get(authMiddleWare,getTask).post(authMiddleWare,createTask);
taskRouter.route('/:id/gp').get(authMiddleWare,getTaskById).put(authMiddleWare,updateTask).delete(authMiddleWare,delectTask);


export default taskRouter;