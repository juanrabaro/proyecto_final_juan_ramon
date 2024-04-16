import { Router } from "express";
import { getTimerTasks, getTimerTask, addTimerTask, updateTimerTask, deleteTimerTask } from "../controllers/timerTask.controller.js";
import { validateToken } from '../middlewares/validateToken.js'

const router = Router();

router.get('/timer-tasks', validateToken, getTimerTasks)

router.get('/timer-task/:id', validateToken, getTimerTask)

router.post('/add-timer-task', validateToken, addTimerTask)

router.put('/update-timer-task/:id', validateToken, updateTimerTask)

router.delete('/delete-timer-task/:id', validateToken, deleteTimerTask)


export default router;