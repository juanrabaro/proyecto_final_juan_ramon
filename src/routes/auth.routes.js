import { Router } from "express";
import { register, login, profile } from "../controllers/auth.controller.js";

const router = Router();

router.get('/profile', profile)

router.post('/register', register)

router.post('/login', login)

export default router;