import { db } from "@/db/db";
import { generateAccessToken } from "@/utils/generateJWTToken";
import bcrypt from 'bcrypt';
import { error } from "console";
import { Request, Response } from "express";

export async function Authorization(req:Request, res:Response){
    const {email, username, password} = req.body;

    try {
        let existingUser = null;

        if(email){
            existingUser = await db.user.findUnique({
                where:{
                    email
                }
            })
        }
        
        if(username){
            existingUser = await db.user.findUnique({
                where:{
                    username
                }
            })
        }

        if(!existingUser){
            return res.status(404).json({
                error:"User not found"
            })
        }

        //checking for password is correct or not
        const passwordMatch = await bcrypt.compare(password, existingUser.password)

        if(!passwordMatch){
            return res.status(403).json({
                error:"Wrong credential"
            })
        }
        //destructing out the password from the existing user
        const {password:userPass, ...userWithoutPassword} = existingUser;
        const accessToken = generateAccessToken(userWithoutPassword);
        const result = {
            ...userWithoutPassword,
            accessToken
        }
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Something went wrong"
        });
    }

}