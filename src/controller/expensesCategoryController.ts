import { db } from "@/db/db";
import { Request, Response } from "express";


export async function createExpenseCategory(req:Request, res:Response){
    try {
        const {name, slug} = req.body;

        const existingExpenseCategory = await db.expenseCategory.findUnique({
            where:{
                slug,
            }
        });

        if(existingExpenseCategory){
            return res.status(409).json({
                error:`Category  ${slug} is already existing`
            });
        }

        const newCategory = await db.expenseCategory.create({
            data: {
                name,
                slug
            }
        })
        res.status(201).json({
            data: {newCategory}
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({data:null, error})
    }
}

export async function findAllCatgory(req:Request, res:Response){
    try {
         const categories = await db.expenseCategory.findMany({
            orderBy:{
                createdAt: "desc"
            },
         });

         return res.status(200).json({
            data:categories
         });
    } catch (error) {
        console.log(error);
        return res.status(500).json({data:null, error})
    }
}

export async function DetailOfCategory(req:Request, res:Response){
    try {
        const {id} = req.params;
        const category = await db.expenseCategory.findUnique({
            where:{
                id
            },
        });

        if(!category){
            return res.status(404).json({
                error:"Category not found with this id"
            });
        }

        return res.status(200).json({
            data:category
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({data:null, error})
    }
}

export async function updateExpenseCategory(req:Request, res:Response){
    try {
        const {id} = req.params;
        const {name, slug} = req.body;

        const existingCategory = await db.expenseCategory.findUnique({
            where:{
                id
            }
        });

        if(!existingCategory){
            return res.status(404).json({
                error:"Category not found with this id"
            });
        }

        if(slug !== existingCategory.slug){
            const existingCategoryBySlug = await db.expenseCategory.findUnique({
                where:{
                    slug,
                }
            });
            if(existingCategoryBySlug){
                return res.status(409).json({
                    error:`Category (${name}) is already taken`
                });
            }
        }
        
        const updateCategory = await db.expenseCategory.update({
            where:{
                id,
            },
            data:{
                name,
                slug
            },
        });
        
        return res.status(200).json({
            data: updateCategory
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({data:null, error})
    }
}

export async function DeleteCategory(req:Request, res:Response){
    try {
        const {id} = req.params;
        const category = await db.expenseCategory.findUnique({
            where:{
                id
            },
        });

        if(!category){
            return res.status(404).json({
                error:"Category not found with this id"
            });
        }

        await db.expenseCategory.delete({
            where: {
                id
            }
        });

        return res.status(200).json({
            data: null
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({data:null, error})
    }
}