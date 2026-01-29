import { db } from '@/db/db';
import {Request, Response} from 'express' 

export async function createNotification(req:Request, res:Response){
    try {
        //receiving a data from end user
        const {message, status, statusText, read} = req.body;

        //create a Notification
        const Notification = await db.notification.create({
            data:{
                message, status, statusText, read
            }
        })
        res.status(201).json({
            status:"success",
            Notification
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        })
        
    }
}

export async function GetNotification(req:Request, res:Response){
    try {
        const Notification = await db.notification.findMany({
            orderBy:{
                createdAt:"desc"
            }
        })
        res.status(200).json({
            status:'success',
            length: Notification.length,
            Notification
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        })
    }
}

export async function updateNotification(req:Request, res:Response){
    try {
        const {id} = req.params;
        const {read} = req.body;
        
        const existingNot = await db.notification.findUnique({
            where:{
                id
            }
        })

        if(!existingNot){
            return res.status(404).json({
                error:'Notification is not found with this id'
            })
        }
        const updateNotification = await db.notification.update({
            where:{
                id
            },
            data:{
                read
            }
        })

        res.status(200).json({
            status:"success",
            updateNotification
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        }) 
    }
}

export async function deleteNotifiction(req:Request, res:Response){
    try {
        const {id} = req.params;
        const Notification = await db.notification.delete({
            where:{
                id
            }
        })
        if(!Notification){
            return res.status(404).json({
                error:"Notification not found with this id"
            })
        }
        res.status(200).json({
            status:"success",
            data:null
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        }) 
    }
}