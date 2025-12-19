import { createUnit, DetailUnit, GetUnit, updateUnit } from '@/controller/unitController';
import express from 'express';

const router = express.Router();

router.post("/createUnit", createUnit);
router.get("/getUnit", GetUnit);
router.get("/singleUnit/:id", DetailUnit);
router.put("/updateUnit/:id", updateUnit);
router.delete("/deleteUnit/:id", DetailUnit);

export default router;

