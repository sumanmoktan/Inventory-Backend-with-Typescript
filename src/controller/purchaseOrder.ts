import { db } from '@/db/db';
import { NotificationStatus, PurchaseOrderStatus } from '@/generated/prisma/enums';
import { generateSaleNumber } from '@/utils/generateSaleNumber';
import { error } from 'console';
import {Request, Response} from 'express' 
import { createNotification } from './notificationController';

interface PurchaseOrderItem {
    purchaseOrderId: string;
    productId: string;
    quantity: number;
    productName:string;
    unitCost:number;
    subTotal:number;
    currentStock:number;
}

interface CreatePuchaseOrderProps {
    notes:string; 
    balanceAmount:number; 
    totalAmount:number; 
    shippingCost:number; 
    tax:number; 
    discount:number;  
    status: PurchaseOrderStatus; 
    supplierId:string
    items: PurchaseOrderItem[]
}

export async function createPurchaseOrder(req:Request, res:Response){
       //receiving a data from end user
        const {notes, balanceAmount, totalAmount, shippingCost, tax, discount, items, status, supplierId}:CreatePuchaseOrderProps = req.body;
        
    try {
        //create a transition
        const purchaseId = await db.$transaction(async(transaction)=>{
            //create purchase order
            const purchase = await transaction.purchaseOrder.create({
                data:{
                    notes, 
                    balanceAmount, 
                    totalAmount, 
                    shippingCost, 
                    tax, 
                    discount,  
                    status, 
                    supplierId,
                    refNo: generateSaleNumber(),
                },
            })
            
            //use the items
            for(const item of items){
              //update product stock quantity
               const updatedProduct = await transaction.product.update({
                where: {id: item.productId},
                data:{
                    stockQty:{
                        increment: item.quantity,
                    }, 
                  },
               });

               if(!updatedProduct){
                return res.status(500).json({
                    error:`Failed to update stock for product ID: ${item.productId}`
               });
               }
                //create/send a notification if the product has gone below the threshold or stock alert qty 
                if(updatedProduct.stockQty < updatedProduct.alertQty){
                    //send/create the Notification
                    const message = updatedProduct.stockQty === 0 ? `New stock for ${updatedProduct.name} is out. Current stock: ${updatedProduct.stockQty}.`: `The stock of ${updatedProduct.name} has gone below threshold. Current stock: ${updatedProduct.stockQty}.`;
                    const statusText = "New Stock";
                    const status: NotificationStatus = "INFO";

                    const newNotification = {
                        message,
                        status,
                        statusText
                    };
                    await db.notification.create({
                        data: newNotification,
                    });
                }
                //create purchaseOrder Item
                const purchaseOrderItem = await transaction.purchaseOrderItem.create({
                    data:{
                        purchaseOrderId: purchase.id,
                        productId: item.productId,
                        productName: item.productName,
                        currentStock: item.currentStock,
                        quantity: item.quantity,
                        unitCost:item.unitCost,
                        subTotal:item.subTotal,
                    },
                });
                if(!purchaseOrderItem){
                    return res.status(500).json({
                        error:`Failed to create adjustment`
                    })
                }
            }
            //Return the purchaseId
            return purchase.id;
        });

        const savedPurchaseOrder = await db.purchaseOrder.findUnique({
            where:{
                id: purchaseId as string,
            },
            include:{
                items: true,
            }
        });

        //console.log(savedLineOrder);
        return res.status(201).json({
            data: savedPurchaseOrder
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        })
        
    }
}

export async function GetPurchaseOrders(req:Request, res:Response){
    try {
        const purchaseOrder = await db.purchaseOrder.findMany({
            orderBy:{
                createdAt:"desc"
            },
            include:{
                items: true,
                supplier: true
            }
        })
        res.status(200).json({
            status:'success',
            length: purchaseOrder.length,
            purchaseOrder
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        })
    }
}

