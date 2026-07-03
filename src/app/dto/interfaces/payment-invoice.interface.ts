export interface InvoiceInf {
    id: string;
    invoice: string;
    status: string;
    amount: number;
    color: string;
    metadata: {}
}

export interface TransactionInf {
    id: string;
    tranNo: string;
    invoice: string;
    type:string;
    date:string;
    status: string;
    amount: number;
    color: string;
}

export interface CardInf {
    id: string;
    type: string;
    card_number: string;
    expiry:string,
    isDefault: boolean;
}
