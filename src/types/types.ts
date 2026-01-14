import { PaymentMethod, SaleType } from "@/generated/prisma/enums";

export interface SaleRequestBody {
  customerId: string;
  customerName: string;
  customerEmail: string;
  saleAmount: number;
  paidAmount: number;
  balanceAmount: number;
  saleType: SaleType;
  paymentMethod: PaymentMethod;
  transactionCode: string;
  salesItems: SaleItem[];
}

export interface SaleItem {
    saleId: string;
    productId: string;
    qty: number;
    productPrice: number;
    productName: string;
    productImage: string;
}
