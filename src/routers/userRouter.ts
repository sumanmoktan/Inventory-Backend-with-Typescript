import express from 'express';
import { AllUser, createUser, DetailUser } from '@/controller/userController';

const router = express.Router();

router.post("/createUser", createUser);
router.get("/user", AllUser);
router.get("/detailUser/:id", DetailUser);

export default router;