import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createCustomer(req:Request, res:Response) {
    const {name, email, phone} = req.body;

    try {
        const newCustomer = await db.customer.create({
            data:{
                name,email,phone
            }
        })
        return res.status(201).json({status:'success', newCustomer});
    } catch (error) {
        console.log(error)
    }
}

export async function customer(req: Request, res:Response) {
    try {
      const customer = await db.customer.findMany({
        orderBy:{
          createdAt: "desc"
        }
      });
      return res.status(200).json({status: "success", customer})
    } catch (error) {
      console.log(error)
    }
}

export async function DetailOfCustomer(req:Request, res:Response){
  try {
    const {id} = req.params;
    const CustomerDetail = await db.customer.findUnique({
      where:{
        id
      }
    });
    return res.status(200).json({status: "success", CustomerDetail});
  } catch (error) {
    console.log(error)
  }
}