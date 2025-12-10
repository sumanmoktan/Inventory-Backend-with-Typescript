import express from 'express';
import { AllUser, createUser, DeleteUser, DetailUser, UpdateUser, UpdateUserPassword } from '@/controller/userController';

const router = express.Router();

//create new user
router.post("/createUser", createUser);
//finding all user which are register 
router.get("/user", AllUser);
//find details of user
router.get("/detailUser/:id", DetailUser);
//update user detail 
router.put("/update/:id", UpdateUser);
//update user password
router.put("/updatePassword/:id", UpdateUserPassword);
//delete user 
router.delete("/delete/:id", DeleteUser);

export default router;