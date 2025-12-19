import { db } from '@/db/db';
import { error } from 'console';
import {Request, Response} from 'express' 

export async function createUnit(req:Request, res:Response){
    try {
        //receiving a data from end user
        const {name, abbreviation, slug} = req.body;

        //checking a unit is already create or not
        const existingUnit = await db.unit.findUnique({
            where:{
                slug
            }
        })
        if(existingUnit){
            return res.status(409).json({
                error:`Unit with ${slug} is already existing`
            })
        }
        //create a unit
        const newUnit = await db.unit.create({
            data:{
                name,
                abbreviation,
                slug
            }
        })
        res.status(201).json({
            status:"success",
            newUnit
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        })
        
    }
}

export async function GetUnit(req:Request, res:Response){
    try {
        const units = await db.unit.findMany({
            orderBy:{
                createdAt:"desc"
            }
        })
        res.status(200).json({
            status:'success',
            length: units.length,
            units
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        })
    }
}

export async function DetailUnit(req:Request, res:Response){
    try {
        const {id} = req.params;

        const singleUnit = await db.unit.findUnique({
            where:{
                id
            }
        });

        if(!singleUnit){
            return res.status(200).json({
                error:"Unit is not found with this id"
            })
        }

        res.status(200).json({
            status:"success",
            singleUnit
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        })
    }
}

export async function updateUnit(req:Request, res:Response){
    try {
        const {id} = req.params;
        const {name, abbreviation, slug} = req.body;
        
        const unit = await db.unit.findUnique({
            where:{
                id
            }
        })

        if(!unit){
            return res.status(404).json({
                error:'Unit is not found with this id'
            })
        }
        //if the slug are unique
        if(slug !==unit.slug){
            const existingSlug = await db.unit.findUnique({
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
        const updateUnit = await db.unit.update({
            where:{
                id
            },
            data:{
                name, abbreviation, slug
            }
        })

        res.status(200).json({
            status:"success",
            updateUnit
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        }) 
    }
}

export async function deleteUnit(req:Request, res:Response){
    try {
        const {id} = req.params;
        const unit = await db.unit.findUnique({
            where:{
                id
            }
        })
        if(!unit){
            return res.status(404).json({
                error:"Unit not found with this id"
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