import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createProduct(req:Request, res:Response){
    try {
       const {  name,       
                description,
                batchNumber,
                barCode,    
                image,      
                tax,        
                alertQty,   
                stockQty,   
                price, 
                wholesalePrice,     
                buyingPrice,
                sku,        
                productCode,
                slug,       
                supplierId, 
                unitId, 
                shopId,     
                brandId,    
                categroyId, 
                expiryDate 
                
            } = req.body;
            
            // check the unique for barCode, sku, productCode, slug 
            const existingSlug = await db.product.findUnique({
                where:{
                    slug
                }
            });
            if(existingSlug){
                return res.status(409).json({
                    error:`Product ${slug} is already existing`
                })
            }
           if(barCode){
             const existingBarCode = await db.product.findUnique({
                where:{
                    barCode
                }
            });
            if(existingBarCode){
                return res.status(409).json({
                    error:`Product ${barCode} is already existing`
                })
            }
           }
            const existingSku = await db.product.findUnique({
                where:{
                    sku
                }
            });
            if(existingSku){
                return res.status(409).json({
                    error:`Product ${sku} is already existing`
                })
            }
             //checking if product is already exist 
            const existingProductCode = await db.product.findUnique({
                where:{
                    productCode
                }
            });
            if(existingProductCode){
                return res.status(409).json({
                    error:`Product ${productCode} is already existing`
                })
            }
            //create Product 
            const Product = await db.product.create({
               data:{
                    name,       
                    description,
                    batchNumber,
                    barCode,    
                    image,      
                    tax,        
                    alertQty,   
                    stockQty,   
                    price,
                    wholesalePrice,      
                    buyingPrice,
                    sku,        
                    productCode,
                    slug,       
                    supplierId, 
                    unitId,     
                    shopId,
                    brandId,    
                    categroyId, 
                    expiryDate 
               }
            })

        //returning a data to user
        return res.status(201).json({
            status:"success",
            data: Product
        })
           
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Something went wrong"
        })
    }
}

export async function GetAllProudct(req:Request, res:Response){
    try {
        const proudct = await db.product.findMany({
            orderBy:{
                createdAt:"desc"
            }
        })
        return res.status(200).json({
            status:"Success",
            length:proudct.length,
            data:proudct
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Something went wrong"
        }) 
    }
}

export async function DetailProduct(req:Request, res:Response) {
    try {
        const {id} = req.params;
        
        const singleProduct = await db.product.findUnique({
            where:{
                id
            }
        });
        
        if(!singleProduct){
            return res.status(404).json({
                error:"Product not found with this id",
                data:null
            })
        }
        return res.status(200).json({
            status:"Success",
            data: singleProduct
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Something went wrong"
        }) 
    }
}

export async function UpdateProduct(req:Request, res:Response){
    try {
        const {id} = req.params;
        const {  name,       
                description,
                batchNumber,
                barCode,    
                image,      
                tax,        
                alertQty,   
                stockQty,   
                price,  
                wholesalePrice,    
                buyingPrice,
                sku,        
                productCode,
                slug,       
                supplierId, 
                unitId,   
                shopId,  
                brandId,    
                categroyId, 
                expiryDate 
                
            } = req.body;
            
        const product = await db.product.findUnique({
            where:{
                id
            }
        });

        if(!product){
            return res.status(404).json({
                error:"Product not found with this id"
            });
        }

         //if the slug are unique
        if(slug !==product.slug){
            const existingSlug = await db.product.findUnique({
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
         if(sku !==product.sku){
            const existingSku = await db.product.findUnique({
                where:{
                    sku
                }
            })
            if(existingSku){
                return res.status(409).json({
                    error:`Sku (${sku}) is already taken`
                })
            }
        }

         if(productCode !==product.productCode){
            const existingProductCode = await db.product.findUnique({
                where:{
                    productCode
                }
            })
            if(existingProductCode){
                return res.status(409).json({
                    error:`ProductCode (${productCode}) is already taken`
                })
            }
        }

         if(barCode && barCode !==product.barCode){
            const existingBarCode = await db.product.findUnique({
                where:{
                    barCode
                }
            })
            if(existingBarCode){
                return res.status(409).json({
                    error:`Barcode (${barCode}) is already taken`
                })
            }
        }

        //update the product
        const updateProduct = await db.product.update({
            where:{
                id
            },
            data:{
                name,       
                description,
                batchNumber,
                barCode,    
                image,      
                tax,        
                alertQty,   
                stockQty,   
                price,      
                buyingPrice,
                sku,        
                productCode,
                slug,       
                supplierId, 
                unitId,     
                brandId,    
                categroyId, 
                expiryDate 
            }
        });

        return res.status(200).json({
            status:"Success",
            data: updateProduct
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Something went wrong"
        })
    }
}

export async function DeleteProduct(req:Request, res:Response){
    try {
        const {id} = req.params;

        const proudct = await db.product.findUnique({
            where:{
                id
            }
        });
        if(!proudct){
            return res.status(404).json({
                error:'Product is not found'
            });
        }

        await db.product.delete({
            where:{
                id
            }
        });
        return res.status(200).json({
            status:"Success",
            data:null
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Something went wrong"
        })
    }
}