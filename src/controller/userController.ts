import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from 'bcrypt'


export async function createUser(req:Request, res:Response) {
    const {email, username, password, firstName, lastName, phone, dob, gender, role, image } = req.body;

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
               role,
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
        res.status(500).json({
            error: 'Something went wrong',
            data: null
        })
    }
}

export async function AllUser(req:Request, res:Response){
    try {
        const AllUser = await db.user.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
        const filterPassword = AllUser.map((user)=>{
            const {password, ...others} = user;
            return others;
        })
        res.status(200).json({status: "success", count:filterPassword.length, data:
            filterPassword,
            error: null,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Something went wrong',
            data: null
        })
    }
}

export async function GetAttendants(req:Request, res:Response){
    try {
        const AllUser = await db.user.findMany({
            orderBy: {
                createdAt: "desc"
            },
            where:{
                role: "ATTENDANT"
            }
        })
        const filterPassword = AllUser.map((user)=>{
            const {password, ...others} = user;
            return others;
        })
        res.status(200).json({status: "success", count:filterPassword.length, data:
            filterPassword,
            error: null,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Something went wrong',
            data: null
        })
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
        if(!userDetail){
           return res.status(404).json({
                data:null,
                error:'User Not found'
            })
        }
       const {password, ...others} = userDetail;
        res.status(200).json({status:"success", data: others, error:null})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Something went wrong',
            data: null
        })
    }
}

export async function UpdateUser(req:Request, res:Response){
    const {id} = req.params;
    const {email, username,firstName, lastName, phone, password, dob, gender, image} = req.body;

    try {
        //find the user with id
         const existingUser = await db.user.findUnique({
            where: {
                id
            }
        })
        //if user doesnot exist then it must return a error with message like not found
        if(!existingUser){
           return res.status(404).json({
                data:null,
                error:'User Not found'
            })
        }
        //if email, username, phone are unique
        if(email && email !== existingUser.email){
            const existingUserByEmail = await db.user.findUnique({
            where:{
                email
            }
        })

        if(existingUserByEmail){
            res.status(409).json({
                error:`Email ${email} Already Taken`,
                data:null
            })
            return
        }
        }

        if(phone && phone !== existingUser.phone){
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
        }

        if(username && username !== existingUser.username){
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
        }

        //hash the password if passowrd is exist
        let hashedPassword = existingUser.password;
        if(password){
            hashedPassword = await bcrypt.hash(password, 12)
        }
        //Update user
        const updateUser = await db.user.update({
            where:{id},
            data:{
                email,
                username,
                password:hashedPassword,
                firstName,
                lastName, 
                phone, 
                dob, 
                gender, 
                image,  
            }
        })
        const {password:userPass, ...others} = updateUser;
        res.status(200).json({
            data: others,
            error:null
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Something went wrong"})
    }
}

export async function UpdateUserPassword(req:Request, res:Response){
    const {id} = req.params;
    const {password} = req.body;

    try {
         const userDetail = await db.user.findUnique({
            where: {
                id
            }
        })
        if(!userDetail){
           return res.status(404).json({
                data:null,
                error:'User Not found'
            })
        }
        //hashed user Password
        const hashPassword:string = await bcrypt.hash(password, 12);
        const updateUser = await db.user.update({
            where:{id},
            data:{
                password:hashPassword
            }
        })
        const {password:savePassword, ...others} = updateUser;
        res.status(200).json({
            data: others,
            error:null
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Something went wrong"})
    }
}

export async function DeleteUser(req:Request, res:Response){
    const {id} = req.params;
    try {
        const user = await db.user.findUnique({
            where:{
                id
            }
        })

        if(!user){
            return res.status(404).json({
                error: "User Not found with this id"
            })
        }
        
        await db.user.delete({
            where:{
                id
            }
        })
        res.status(200).json({
            status: "success",
            data: null,
            
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Something went wrong"
        })
    }

}