import { Router } from "express";
import { getCronoTasks, getCronoTask, addCronoTask, updateCronoTask, deleteCronoTask } from "../controllers/cronoTask.controller.js";
import { validateToken } from '../middlewares/validateToken.js'

const router = Router();

router.get('/crono-tasks', validateToken, getCronoTasks)

router.get('/crono-task/:id', validateToken, getCronoTask)

router.post('/add-crono-task', validateToken, addCronoTask)

router.put('/update-crono-task/:id', validateToken, updateCronoTask)

router.delete('/delete-crono-task/:id', validateToken, deleteCronoTask)


export default router;