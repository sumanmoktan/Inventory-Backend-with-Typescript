import { createNotification, deleteNotifiction, GetNotification, updateNotification } from '@/controller/notificationController';
import express from 'express';

const router = express.Router();

router.post('/createNotification', createNotification);
router.get("/getNotification", GetNotification);
router.put("/updateNotification/:id", updateNotification);
router.delete("/deleteNotification/:id", deleteNotifiction);


export default router;