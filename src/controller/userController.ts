import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import { error } from "console";


export async function createUser(req:Request, res:Response) {
    const {email, username, password, firstName, lastName, phone, dob, gender, image } = req.body;

    try {
        const existingUserByEmail = await db.user.findUnique({
            where:{
                email
            }
        })

        if(existingUserByEmail){
            res.status(409).json({
                error:`Email Already Taken`,
                data:null
            })
            return
        }

         const existingUserByPhone = await db.user.findUnique({
            where:{
                phone
            }
        });

        if(existingUserByPhone){
            res.status(409).json({
                error:`Phone Number ${phone} Already Used`,
                data:null
            })
            return
        }

        const existUserByUsername = await db.user.findUnique({
            where:{
                username
            }
        })

        if(existUserByUsername){
            res.status(409).json({
                error:`UserName ${username} is taken already `
            })
            return
        }

        //hashed user Password
        const hashPassword = await bcrypt.hash(password, 12);
         
        const newUser= await db.user.create({
            data:{
               email, 
               username, 
               password : hashPassword,
               firstName, 
               lastName, 
               phone, 
               dob, 
               gender, 
               image: image ? image : "https://utfs.io/f/c61ec63c-42b1-4939-a7fb-ed04d43e23ee-2558r.png"
            }
        })
     res.status(201).json({status:'success', data:
        newUser,
        error:null
     });
    } catch (error) {
        console.log(error)
    }
}
