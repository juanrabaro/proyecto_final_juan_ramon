import { Router } from "express";
import { register, login, profile, logout, verifyToken } from "../controllers/auth.controller.js";
import { validateToken } from '../middlewares/validateToken.js'

const router = Router();

router.post('/profile', validateToken, profile)

router.post('/verify-token', verifyToken)

router.post('/register', register)

router.post('/login', login)

router.post('/logout', logout)

export default router;