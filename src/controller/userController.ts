import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import { stat } from "fs";



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
        const hashPassword:string = await bcrypt.hash(password, 12);
         
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
        //modify return user
        const {password:savePassword, ...others} = newUser;
     res.status(201).json({status:'success', data:
        others,
        error:null
     });
    } catch (error) {
        console.log(error)
    }
}

export async function AllUser(req:Request, res:Response){
    try {
        const AllUser = await db.user.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
        res.status(200).json({status: "success", data:{
            AllUser
        }})
    } catch (error) {
        console.log(error)
    }
}

export async function DetailUser(req:Request, res:Response){
    const {id} = req.params;
    try {
        const userDetail = await db.user.findUnique({
            where: {
                id
            }
        })
        res.status(200).json({status:"success", data:{
            userDetail
        }})
    } catch (error) {
        console.log(error)
    }
}