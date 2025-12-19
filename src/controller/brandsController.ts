import { db } from '@/db/db';
import {Request, Response} from 'express' 

export async function createBrand(req:Request, res:Response){
    try {
        //receiving a data from end user
        const {name, slug} = req.body;

        //checking a unit is already create or not
        const existingBrand = await db.brand.findUnique({
            where:{
                slug
            }
        })
        if(existingBrand){
            return res.status(409).json({
                error:`Brand with ${slug} is already existing`
            })
        }
        //create a unit
        const newBrand = await db.brand.create({
            data:{
                name,
                slug
            }
        })
        res.status(201).json({
            status:"success",
            newBrand
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        })
        
    }
}

export async function GetBrand(req:Request, res:Response){
    try {
        const Brand = await db.brand.findMany({
            orderBy:{
                createdAt:"desc"
            }
        })
        res.status(200).json({
            status:'success',
            length: Brand.length,
            Brand
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        })
    }
}

export async function DetailBrand(req:Request, res:Response){
    try {
        const {id} = req.params;

        const singleBrand = await db.brand.findUnique({
            where:{
                id
            }
        });

        if(!singleBrand){
            return res.status(200).json({
                error:"Brand is not found with this id"
            })
        }

        res.status(200).json({
            status:"success",
            singleBrand
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        })
    }
}

export async function updateBrand(req:Request, res:Response){
    try {
        const {id} = req.params;
        const {name,slug} = req.body;
        
        const Brand = await db.brand.findUnique({
            where:{
                id
            }
        })

        if(!Brand){
            return res.status(404).json({
                error:'Brand is not found with this id'
            })
        }
        //if the slug are unique
        if(slug !==Brand.slug){
            const existingSlug = await db.brand.findUnique({
                where:{
                    slug
                }
            })
            if(existingSlug){
                return res.status(409).json({
                    error:`Slug (${slug}) is already taken`
                })
            }
        }
        const updateBrand = await db.brand.update({
            where:{
                id
            },
            data:{
                name, slug
            }
        })

        res.status(200).json({
            status:"success",
            updateBrand
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        }) 
    }
}

export async function deleteBrand(req:Request, res:Response){
    try {
        const {id} = req.params;
        const Brand = await db.brand.findUnique({
            where:{
                id
            }
        })
        if(!Brand){
            return res.status(404).json({
                error:"Brand not found with this id"
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