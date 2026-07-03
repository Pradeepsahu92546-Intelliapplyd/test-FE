export interface BillingItem {
  id: string;
  userSub: string;
  address: string;
  billDate: string;
  dueDate: string;
  nextBillDate: string | null;
  payStatus: string;
  payId: string | null;
  payMethod: string | null;
  isTrail: boolean;
  isRecurring: boolean;
  isBillable: boolean;
  billableAmount: number;
  createdAt: string;
  updatedAt: string;
  description: string | null;
}