import { db } from '@/db/db';
import { SaleItem, SaleRequestBody } from '@/types/types';
import { generateSaleNumber } from '@/utils/generateSaleNumber';
import {Request, Response} from 'express' 

export async function createSales(req: Request, res: Response) {
  const {
    customerId,
    customerName,
    customerEmail,
    saleAmount,
    balanceAmount,
    paidAmount,
    saleType,
    paymentMethod,
    transactionCode,
    salesItems,
  }: SaleRequestBody = req.body;

  try {
    const saleId = await db.$transaction(async (transaction) => {
      const sale = await transaction.sale.create({
        data: {
          customerId,
          customerName,
          customerEmail,
          paymentMethod,
          saleNumber: generateSaleNumber(),
          saleAmount,
          saleType,
          balanceAmount,
          paidAmount,
          transactionCode,
        },
      });

      if (salesItems && salesItems.length > 0) {
        for (const item of salesItems) {
          const updatedProduct = await transaction.product.update({
            where: { id: item.productId },
            data: {
              stockQty: {
                decrement: item.qty,
              },
            },
          });

          if (!updatedProduct) {
            throw new Error("Failed to update product quantity");
          }

          const saleItem = await transaction.saleItems.create({
            data: {
              saleId: sale.id,
              productId: item.productId,
              qty: item.qty,
              productPrice: item.productPrice,
              productName: item.productName,
              productImage: item.productImage,
            },
          });

          if (!saleItem) {
            throw new Error("Failed to create sale item");
          }
        }
      }

      return sale.id; // ✅ MUST return
    });

    const sale = await db.sale.findUnique({
      where: { id: saleId },
      include: { salesItems: true },
    });

    return res.status(201).json(sale);
  } catch (error) {
    console.error("Transaction error:", error);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
}

export async function createSalesItems(req: Request, res: Response) {
  const {saleId,productId,qty,productPrice,productName, productImage} = req.body;

  try { 
    const updatedProduct = await db.product.update({
            where: { id: productId },
            data: {
              stockQty: {
                decrement: qty,
              },
            },
          });
          const saleItem = await db.saleItems.create({
            data: {
              saleId,
              productId,
              qty,
              productPrice,
              productName,
              productImage,
            },
          });
    return res.status(201).json(saleItem);
  } catch (error) {
    console.error("Transaction error:", error);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
}



export async function getSale(req:Request, res:Response) {
  try {
    const sale = await db.sale.findMany({
      orderBy:{
        createdAt: "desc",
      },
      include:{
        salesItems:true,
      }
    });
    res.status(200).json({
      status:"success",
      length:sale.length,
      data: sale
    })
  } catch (error) {
     console.error(error);
    return res.status(500).json({
      error:"Something went wrong"
    })
  }
}

export async function getSaleDetail(req:Request, res:Response) {
  try {
    const {id} = req.params;
    const sale = await db.sale.findUnique({
      where:{
        id
      }
    });
    res.status(200).json({
      status:"success",
      data: sale
    })
  } catch (error) {
     console.error(error);
    return res.status(500).json({
      error:"Something went wrong"
    })
  }
}