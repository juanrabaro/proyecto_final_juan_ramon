import { Router } from "express";
import { register } from "../controllers/auth.controller.js";

const router = Router();

router.get('/profile', (req, res) => {
  res.send('Hello World');
})

router.post('/register', register)

router.post('/login', (req, res) => {
  res.send('Hello World');
})

export default router;