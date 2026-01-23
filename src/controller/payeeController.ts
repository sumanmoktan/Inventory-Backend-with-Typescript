import { db } from "@/db/db";
import { Request, Response } from "express";
import { error } from "node:console";

export async function createPayee(req:Request, res:Response){
    try {
        const {name, phone} = req.body;

        const existingPayee = await db.payee.findUnique({
            where:{
                phone,
            }
        });

        if(existingPayee){
            return res.status(409).json({
                error:`Phone Number  ${phone} is already existing`
            });
        }

        const newPayee = await db.payee.create({
            data: {
                name,
                phone
            }
        })
        res.status(201).json({
            data: newPayee
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({data:null, error})
    }
}

export async function findAllPayee(req:Request, res:Response){
    try {
         const payee = await db.payee.findMany({
            orderBy:{
                createdAt: "desc"
            },
         });

         return res.status(200).json({
            data:payee
         });
    } catch (error) {
        console.log(error);
        return res.status(500).json({data:null, error})
    }
}

export async function DetailOfPayee(req:Request, res:Response){
    try {
        const {id} = req.params;
        const payee = await db.payee.findUnique({
            where:{
                id
            },
        });

        if(!payee){
            return res.status(404).json({
                error:"Payee not found with this id"
            });
        }

        return res.status(200).json({
            data:payee
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({data:null, error})
    }
}

export async function updatePayee(req:Request, res:Response){
    try {
        const {id} = req.params;
        const {name, phone} = req.body;

        const existingPayee = await db.payee.findUnique({
            where:{
                id
            }
        });

        if(!existingPayee){
            return res.status(404).json({
                error:"payee not found with this id"
            });
        }

        if(phone !== existingPayee.phone){
            const existingPayeeByPhone = await db.payee.findUnique({
                where:{
                    phone,
                }
            });
            if(existingPayeeByPhone){
                return res.status(409).json({
                    error:`Phone Number (${phone}) is already taken`
                });
            }
        }
        
        const updatePayee = await db.payee.update({
            where:{
                id,
            },
            data:{
                name,
                phone
            },
        });
        
        return res.status(200).json({
            data: updatePayee
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({data:null, error})
    }
}

export async function DeletePayee(req:Request, res:Response){
    try {
        const {id} = req.params;
        const payee = await db.payee.findUnique({
            where:{
                id
            },
        });

        if(!payee){
            return res.status(404).json({
                error:"Payee not found with this id"
            });
        }

        await db.payee.delete({
            where: {
                id
            }
        });

        return res.status(200).json({
            data: null
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({data:null, error})
    }
}