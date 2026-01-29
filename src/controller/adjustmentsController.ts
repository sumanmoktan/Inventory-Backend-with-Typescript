import { db } from '@/db/db';
import { NotificationStatus } from '@/generated/prisma/enums';
import { generateSaleNumber } from '@/utils/generateSaleNumber';
import { error } from 'console';
import {Request, Response} from 'express' 
import { createNotification } from './notificationController';

interface AdjustmentItem {
    adjustmentId: string;
    productId: string;
    quantity: number;
    type: string;
    currentStock: number;
    productName: string;
}

interface CreateAdjustmentProps {
    reason: string;
    items: AdjustmentItem[]
}

export async function createAdjustment(req:Request, res:Response){
       //receiving a data from end user
        const { reason, items}:CreateAdjustmentProps = req.body;
        
    try {
        //create a transition
        const adjustmentId = await db.$transaction(async(transaction)=>{
            //create adjustment
            const adjustment = await transaction.adjustment.create({
                data:{
                    reason,
                    refNo: generateSaleNumber(),
                },
            })
            
            //use the items
            for(const item of items){
              //update product stock quantity
              let query;
               if(item.type == "Addition"){
                    query = {
                        increment: item.quantity,
                    };
               } else if (item.type == "Subtraction"){
                    query = {
                        decrement: item.quantity,
                    };
               }
               const updatedProduct = await transaction.product.update({
                where: {id: item.productId},
                data:{
                    stockQty: query
                },
               });

               if(!updatedProduct){
                return res.status(500).json({
                    error:`Failed to update stock for product ID: ${item.productId}`
               });
               }
                //create a notification if the product has gone below the threshold or stock alert qty 
                if(updatedProduct.stockQty < updatedProduct.alertQty){
                    //send/create the Notification
                    const message = updatedProduct.stockQty === 0 ? `The stock of ${updatedProduct.name} is out. Current stock: ${updatedProduct.stockQty}.`: `The stock of ${updatedProduct.name} has gone below threshold. Current stock: ${updatedProduct.stockQty}.`;
                    const statusText = updatedProduct.stockQty === 0 ? "Stock Out" : "Warning";
                    const status: NotificationStatus = updatedProduct.stockQty === 0 ? "DANGER" : "WARNING";

                    const newNotification = {
                        message,
                        status,
                        statusText
                    };
                    await db.notification.create({
                        data: newNotification,
                    });
                }
                //create Adjustment Item
                const adjustmentItem = await transaction.adjustmentItem.create({
                    data:{
                        adjustmentId: adjustment.id,
                        productId: item.productId,
                        productName: item.productName,
                        currentStock: item.currentStock,
                        quantity: item.quantity,
                        type: item.type,
                    },
                });
                if(!adjustmentItem){
                    return res.status(500).json({
                        error:`Failed to create adjustment`
                    })
                }
            }
            //Return the adjustmentId
            return adjustment.id;
        });

        const savedAdjustment = await db.adjustment.findUnique({
            where:{
                id: adjustmentId as string,
            },
            include:{
                items: true,
            }
        });

        //console.log(savedLineOrder);
        return res.status(201).json({
            data: savedAdjustment
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        })
        
    }
}

export async function GetAdjustment(req:Request, res:Response){
    try {
        const adjustment = await db.adjustment.findMany({
            orderBy:{
                createdAt:"desc"
            },
            include:{
                items: true
            }
        })
        res.status(200).json({
            status:'success',
            length: adjustment.length,
            adjustment
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        })
    }
}

