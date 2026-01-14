import { Authorization, changePassword, forgotPassword, verifyToken } from '@/controller/authController';
import express from 'express';

const router = express.Router();

router.post("/login", Authorization);
router.put("/forgot-password", forgotPassword);
router.get("/verifyToken", verifyToken);
router.put("/changePassword", changePassword);


export default router;