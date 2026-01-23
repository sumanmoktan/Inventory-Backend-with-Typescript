import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createExpense(req:Request, res:Response){
    try {
        const {title, amount, description, attachments, expenseDate, payeeId, shopId, categoryId } = req.body;

        //Create expenses
        const expenses = await db.expense.create({
            data:{
                title, amount, description, attachments, expenseDate, payeeId, shopId, categoryId 
            }
        });

        return res.status(201).json({
            data: expenses
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Something went Wrong"
        })
    }
}

export async function getAllExpenses(req:Request, res:Response){
    try {
        const expenses = await db.expense.findMany({
            orderBy:{
                createdAt: "desc"
            }
        })
        
        return res.status(200).json({
            data: expenses
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Something went Wrong"
        }) 
    }
}

export async function detailOfExpenses(req:Request, res:Response){
    try {
        const {id} = req.params;
        
        const existingExpenses = await db.expense.findUnique({
            where:{
                id
            }
        });

        if(!existingExpenses){
            return res.status(404).json({
                error:"Expenses is not found with this id",
            });
        }

        return res.status(200).json({
            data: existingExpenses
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Something went Wrong"
        })
    }
}

export async function updateExpense(req:Request, res:Response){
    try {
        const {id} = req.params;
        const {title, amount, description, attachments, expenseDate, payeeId, shopId, categoryId } = req.body;

        const existingExpenses = await db.expense.findUnique({
            where:{
                id
            }
        });

        if(!existingExpenses){
            return res.status(404).json({
                error:"Expenses is not found with this id",
            });
        }

        //updating a expense Tracker
        const updateExpense = await db.expense.update({
            where:{
                id
            },
            data:{
                title, amount, description, attachments, expenseDate, payeeId, shopId, categoryId 
            }
        });

        return res.status(200).json({
            data:updateExpense
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Something went Wrong"
        })
    }
}

export async function DeleteExpense(req:Request, res:Response){
    try {
        const {id} = req.params;
        const existingExpenses = await db.expense.findUnique({
            where:{
                id
            }
        });
        if(!existingExpenses){
            return res.status(404).json({
                error:"Expense is not found with this id"
            });
        }
        await db.expense.delete({
            where:{
                id
            }
        });

        res.status(200).json({
            data: null
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Something went Wrong"
        })
    }
}