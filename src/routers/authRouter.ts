import { Authorization } from '@/controller/authController';
import express from 'express';

const router = express.Router();

router.post("/login", Authorization);

export default router;