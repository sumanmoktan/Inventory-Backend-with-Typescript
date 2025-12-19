import { Request, Response } from "express";
import { db } from "@/db/db";
import { error } from "console";


export async function CreateSupplier(req:Request, res:Response){
    try {
        //first we receive a data from frontend
        const { supplierType,      
                name,              
                contactPerson,     
                phone,             
                email,             
                location,          
                country,           
                website,           
                taxPin,            
                registrationNumber,
                bankAccountNumber, 
                bankName,          
                paymentTerms,      
                logo,              
                rating,            
                notes,             
                } = req.body;
        //check the email, phone and registrationNumber are unique
         const existCustomerByphone = await db.supplier.findUnique({
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
              const existCustomerByeamil = await db.supplier.findUnique({
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
        
        if(registrationNumber){
            const existCustomerByNID = await db.supplier.findUnique({
                where:{
                   registrationNumber
                }
            })  
        
            if(existCustomerByNID){
                return res.status(409).json({
                    error:`NationalID ${registrationNumber} is already taken`
                })
            }
        
        }

    // creating supplier 
    const newSupplier = await db.supplier.create({
        data:{
            supplierType,      
            name,              
            contactPerson,     
            phone,             
            email,             
            location,          
            country,           
            website,           
            taxPin,            
            registrationNumber,
            bankAccountNumber, 
            bankName,          
            paymentTerms,      
            logo,              
            rating,            
            notes,  
        }, 
    });
    res.status(201).json({
        status:"success",
        newSupplier
    })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Something went wrong"
        })
    }
}

export async function GetAllSupplier(req:Request, res:Response) {
    try {
        const supplier= await db.supplier.findMany({
            orderBy:{
                createdAt: "desc"
            }
        })
        res.status(200).json({
            status:"success",
            length:supplier.length,
            supplier
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong"})
    }
}

export async function DetailSupllier(req:Request, res:Response){
    try {
        const {id} = req.params;
        const singleSupplier = await db.supplier.findUnique({
            where:{
                id
            }
        });
        if(!singleSupplier){
            res.status(404).json({
                error:"Supplier not found with this id"
            })
        }
        res.status(200).json({
            status:"success",
            singleSupplier
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong"})
    }
}