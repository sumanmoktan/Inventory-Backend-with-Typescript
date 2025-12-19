import { db } from "@/db/db";
import { error } from "console";
import { Request, Response } from "express";



export async function createShop(req:Request, res:Response){
    try {
        //Get Data 
         const {name, slug, location, adminId, attendantIds } = req.body;
         //Check the shop if already exist or not
         const existShop = await db.shop.findUnique({
            where:{
                slug
            }
         })

         if(existShop){
            return res.status(409).json({
                error:`Shop with (${name}) already existing`
            })
         }
         //create a shop
         const newShop = await db.shop.create({
          data:{
              name,
              slug, 
              location,
              adminId,
              attendantIds
            }
         })
         //Return a created Shop
        res.status(201).json({
            data: newShop,
            error: null
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Something went wrong"
        })
    }
}

export async function AllShop(req:Request, res:Response){
    try {
        const shop = await db.shop.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
        res.status(200).json({
            status: "Success",
            length: shop.length,
            data: shop,
            error:null
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Something went wrong"
        })
    }
}

export async function GetShopAttendants(req:Request, res:Response){
    try {

        const {id} = req.params;

        const existingShop = await db.shop.findUnique({
            where:{
                id
            }
        })

        if(!existingShop){
            return res.status(404).json({
                error:'Shop not found with this id'
            })
        }

       const attendants = await db.user.findMany({
            where: {
                id: { in: existingShop.attendantIds || [] }
            },
            select:{
                id:true,
                firstName:true,
                lastName:true,
                image:true,
                phone:true,
                email:true
            }
        });

        res.status(200).json({
            status: "Success",
            length: attendants.length,
            data: attendants,
            error:null
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Something went wrong"
        })
    }
}


export async function ShopDetail(req:Request, res:Response) {
    const {id} = req.params;
    try {
        const singleShop = await db.shop.findUnique({
            where:{
                id
            }
        })
        if(!singleShop){
            return res.status(404).json({
                error:"Shop not found with given id"
            })
        }
        res.status(200).json({
            data: singleShop,
            error: null
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:'Something went wrong'
        })
    }
}



// export async function updateShop(req:Request, res:Response){
//     const {name, slug, location, adminId, attendantIds} = req.body;
//     try {
//         const shop = await db.shop.update({
//             data:{
//                 name, 
//                 slug,
//                 location,
//                 adminId,
//                 attendantIds
//             }
//         })
//         res.status(200).json({
//             data:shop,
//             error:null
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             error: "Something went wrong"
//         })
//     }
// }