import { Router } from "express";
import { getTasks, getTask, addTask, updateTask, deleteTask } from "../controllers/task.controller.js";
import { validateToken } from '../middlewares/validateToken.js'

const router = Router();

router.get('/tasks', validateToken, getTasks)

router.get('/task/:id', validateToken, getTask)

router.post('/add-task', validateToken, addTask)

router.put('/update-task/:id', validateToken, updateTask)

router.delete('/delete-task/:id', validateToken, deleteTask)


export default router;