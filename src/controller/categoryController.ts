import { db } from '@/db/db';
import {Request, Response} from 'express' 

export async function createCategory(req:Request, res:Response){
    try {
        //receiving a data from end user
        const {name, slug} = req.body;

        //checking a category is already create or not
        const existingCategory = await db.category.findUnique({
            where:{
                slug
            }
        })
        if(existingCategory){
            return res.status(409).json({
                error:`Category with ${slug} is already existing`
            })
        }
        //create a category
        const newCategory = await db.category.create({
            data:{
                name,
                slug
            }
        })
        res.status(201).json({
            status:"success",
            newCategory
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        })
        
    }
}

export async function GetCategory(req:Request, res:Response){
    try {
        const Category = await db.category.findMany({
            orderBy:{
                createdAt:"desc"
            }
        })
        res.status(200).json({
            status:'success',
            length: Category.length,
            Category
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        })
    }
}

export async function DetailCategory(req:Request, res:Response){
    try {
        const {id} = req.params;

        const singleCategory = await db.category.findUnique({
            where:{
                id
            }
        });

        if(!singleCategory){
            return res.status(200).json({
                error:"Category is not found with this id"
            })
        }

        res.status(200).json({
            status:"success",
            singleCategory
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        })
    }
}

export async function updateCategory(req:Request, res:Response){
    try {
        const {id} = req.params;
        const {name,slug} = req.body;
        
        const Category = await db.category.findUnique({
            where:{
                id
            }
        })

        if(!Category){
            return res.status(404).json({
                error:'Category is not found with this id'
            })
        }
        //if the slug are unique
        if(slug !==Category.slug){
            const existingSlug = await db.category.findUnique({
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
        const updateCategory = await db.category.update({
            where:{
                id
            },
            data:{
                name, slug
            }
        })

        res.status(200).json({
            status:"success",
            updateCategory
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Something went wrong'
        }) 
    }
}

export async function deleteCategory(req:Request, res:Response){
    try {
        const {id} = req.params;
        const Category = await db.category.findUnique({
            where:{
                id
            }
        })
        if(!Category){
            return res.status(404).json({
                error:"Category not found with this id"
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