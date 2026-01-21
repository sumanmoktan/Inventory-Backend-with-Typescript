import { db } from '@/db/db';
import { SaleItem, SaleRequestBody } from '@/types/types';
import { generateSaleNumber } from '@/utils/generateSaleNumber';
import {Request, Response} from 'express' 
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  endOfDay,
  endOfWeek,
  endOfMonth,
} from "date-fns";
import { error } from 'node:console';

export async function createSales(req: Request, res: Response) {
  const {
    customerId,
    customerName,
    customerEmail,
    saleAmount,
    balanceAmount,
    paidAmount,
    saleType,
    shopId,
    paymentMethod,
    transactionCode,
    salesItems,
  }: SaleRequestBody = req.body;

  try {
    const saleId = await db.$transaction(async (transaction) => {
      //credit the sale
     //if balanceAmount>0
      if(balanceAmount > 0){
        //if the customer is allowed to take credit
        const existingCustomer = await transaction.customer.findUnique({
          where:{
            id:customerId
          }
        })
        if(!existingCustomer){
          return res.status(404).json({
            error:"Customer is not found with this id"
          })
        }

        if(balanceAmount > existingCustomer?.maxCreditLimit){
          return res.status(403).json({
            error:`This customer is not eligible for credit:${balanceAmount}`
          });
        }
        //update the customer unpaidAmount
        //update the customer MaxCredit Amount
        const updateCustomer = await transaction.customer.update({
          where:{
            id:customerId
          },
          data:{
            unpaidCreditAmount:existingCustomer.unpaidCreditAmount + balanceAmount,
            maxCreditLimit:{
              decrement: balanceAmount,
            }
          }
        })
        if(!updateCustomer){
          return res.status(404).json({
            error:"Fail to update a customer credit details"
          })
        }
      }

  
      const sale = await transaction.sale.create({
        data: {
          customerId,
          customerName,
          customerEmail,
          paymentMethod,
          saleNumber: generateSaleNumber(),
          saleAmount,
          saleType,
          shopId,
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
      where: { id: saleId as string },
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

export async function getShopSales(req: Request, res: Response) {
  const { shopId } = req.params;

  const existingShop = await db.shop.findUnique({
    where:{
      id:shopId
    }
  });

  if(!existingShop){
    return res.status(404).json({
      error:"Shop not found with this id"
    })
  }
 
  // Define time periods
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
 
  try {
    // Fetch sales for different periods
    const categorizeSales = async (sales: any[]) => {
      return {
        TotalSale: sales,
        salesPaidInCash: sales.filter(
          (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
        ),
        salesPaidInCredit: sales.filter(
          (sale) => sale.balanceAmount > 0
        ),
        salesByMobileMoney: sales.filter(
          (sale) => sale.paymentMethod === "MOBILE MONEY"
        ),
        salesByHandCash: sales.filter(
          (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
        ),
      };
    };
 
    const salesToday = await db.sale.findMany({
      where: {
        shopId,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });
 
    const salesThisWeek = await db.sale.findMany({
      where: {
        shopId,
        createdAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });
 
    const salesThisMonth = await db.sale.findMany({
      where: {
        shopId,
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });
 
    const salesAllTime = await db.sale.findMany({
      where: {
        shopId,
      },
    });
 
    res.status(200).json({
      today: await categorizeSales(salesToday),
      thisWeek: await categorizeSales(salesThisWeek),
      thisMonth: await categorizeSales(salesThisMonth),
      allTime: await categorizeSales(salesAllTime),
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
}

// export async function getShopsSales(req: Request, res: Response) {
//   // Define time periods
//   const todayStart = startOfDay(new Date());
//   const todayEnd = endOfDay(new Date());
//   const weekStart = startOfWeek(new Date());
//   const weekEnd = endOfWeek(new Date());
//   const monthStart = startOfMonth(new Date());
//   const monthEnd = endOfMonth(new Date());
 
//   try {
//     // Fetch all sales and group by shopId for different periods
//     const categorizeSales = (sales: any[]) => {
//       return {
//         TotalSale: sales,
//         salesPaidInCash: sales.filter(
//           (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
//         ),
//         salesPaidInCredit: sales.filter(
//           (sale) => sale.balanceAmount > 0
//         ),
//         salesByMobileMoney: sales.filter(
//           (sale) => sale.paymentMethod === "MOBILE MONEY"
//         ),
//         salesByHandCash: sales.filter(
//           (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
//         ),
//       };
//     };
 
//     const salesToday = await db.sale.groupBy({
//       by: ["shopId"],
//       _sum: {
//         saleAmount: true,
//         balanceAmount:true,
//         paidAmount:true
//       },
//       where: {
//         createdAt: {
//           gte: todayStart,
//           lte: todayEnd,
//         },
//       },
//     });
 
//     const salesThisWeek = await db.sale.groupBy({
//       by: ["shopId"],
//       _sum: {
//         saleAmount: true,
//       },
//       where: {
//         createdAt: {
//           gte: weekStart,
//           lte: weekEnd,
//         },
//       },
//     });
 
//     const salesThisMonth = await db.sale.groupBy({
//       by: ["shopId"],
//       _sum: {
//         saleAmount: true,
//       },
//       where: {
//         createdAt: {
//           gte: monthStart,
//           lte: monthEnd,
//         },
//       },
//     });
 
//     const salesAllTime = await db.sale.groupBy({
//       by: ["shopId"],
//       _sum: {
//         saleAmount: true,
//       },
//     });
 
//     res.status(200).json({
//       today: categorizeSales(salesToday),
//       thisWeek: categorizeSales(salesThisWeek),
//       thisMonth: categorizeSales(salesThisMonth),
//       allTime: categorizeSales(salesAllTime),
//       error: null,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       error: "Something went wrong",
//       data: null,
//     });
//   }
// }

export async function getShopsSales(req: Request, res: Response) {
  const now = new Date();

  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);

  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  try {
    // 🔹 Helper: group sales by shopId
    const groupByShop = (sales: any[]) => {
      const result: Record<string, any> = {};

      for (const sale of sales) {
        if (!result[sale.shopId]) {
          result[sale.shopId] = {
            shopId: sale.shopId,
            totalSales: 0,
            totalPaid: 0,
            totalBalance: 0,
            salesPaidInCash: [],
            salesPaidInCredit: [],
            salesByMobileMoney: [],
          };
        }

        result[sale.shopId].totalSales += sale.saleAmount;
        result[sale.shopId].totalPaid += sale.paidAmount;
        result[sale.shopId].totalBalance += sale.balanceAmount;

        // ✅ CREDIT SALES
        if (sale.balanceAmount > 0) {
          result[sale.shopId].salesPaidInCredit.push(sale);
        }

        // ✅ CASH SALES (fully paid)
        if (sale.paymentMethod === "CASH" && sale.balanceAmount <= 0) {
          result[sale.shopId].salesPaidInCash.push(sale);
        }

        // ✅ MOBILE MONEY
        if (sale.paymentMethod === "MOBILEMONEY") {
          result[sale.shopId].salesByMobileMoney.push(sale);
        }
      }

      return Object.values(result);
    };

    // 🔹 Fetch raw sales
    const [today, week, month, allTime] = await Promise.all([
      db.sale.findMany({
        where: { createdAt: { gte: todayStart, lte: todayEnd } },
      }),
      db.sale.findMany({
        where: { createdAt: { gte: weekStart, lte: weekEnd } },
      }),
      db.sale.findMany({
        where: { createdAt: { gte: monthStart, lte: monthEnd } },
      }),
      db.sale.findMany(),
    ]);

    return res.status(200).json({
      today: groupByShop(today),
      thisWeek: groupByShop(week),
      thisMonth: groupByShop(month),
      allTime: groupByShop(allTime),
      error: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
}
