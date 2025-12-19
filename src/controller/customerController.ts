import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createCustomer(req:Request, res:Response) {
    try {
      //Receive a data from user
            const {
              customerType,
              firstName,
              lastName,    
              phone ,      
              gender,      
              country,     
              location,    
              maxCreditLimit,
              maxCreditDays,
              taxPin,      
              dob,         
              email,       
              nationalID,
            } = req.body;
         // check the email, phone and nationalIDs are unique
         const existCustomerByphone = await db.customer.findUnique({
          where:{
            phone
          }
         })  

         if(existCustomerByphone){
            return res.status(409).json({
              error:`Phone Number ${phone} is already taken`
            })
         }

         if(email){
          const existCustomerByeamil = await db.customer.findUnique({
          where:{
            email
          }
         })  

         if(existCustomerByeamil){
            return res.status(409).json({
              error:`Email ${email} is already taken`
            })
         }
         }

         if(nationalID){
          const existCustomerByNID = await db.customer.findUnique({
          where:{
            nationalID
          }
         })  

         if(existCustomerByNID){
            return res.status(409).json({
              error:`NationalID ${nationalID} is already taken`
            })
         }

         }

        //create customer
        const newCustomer = await db.customer.create({
            data:{
              customerType,
              firstName,
              lastName,    
              phone ,      
              gender,      
              country,     
              location,    
              maxCreditLimit,
              maxCreditDays,
              taxPin,      
              dob,         
              email,       
              nationalID,
            }
        })
        return res.status(201).json({status:'success', newCustomer});
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          error: 'Something went wrong'
        })

    }
}

export async function customer(req: Request, res:Response) {
    try {
      const customer = await db.customer.findMany({
        orderBy:{
          createdAt: "desc"
        }
      });
      return res.status(200).json({status: "success", length: customer.length, customer})
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

    if(!CustomerDetail){
      return res.status(404).json({
        data: null,
        error:"User not found with this id"
      })
    }
    return res.status(200).json({status: "success", CustomerDetail});
  } catch (error) {
    console.log(error)
    return res.status(500).json({error:'Something went wrong'})
  }
}