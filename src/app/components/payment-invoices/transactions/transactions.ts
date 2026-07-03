import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { icons } from '../../../shared/icons-provider';
import { SubscriptionBillingsService } from '../../../services/subscription-billings-service';

import { TransactionInf } from '../../../dto/interfaces/payment-invoice.interface';

@Component({
  selector: 'app-transactions',
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzTagModule,
    NzButtonModule,
    NzInputModule,
    NzDropDownModule,
    NzDatePickerModule,
    NzIconModule
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class Transactions implements OnInit {
  transactions: TransactionInf[] = [];
  filteredTransactions: TransactionInf[] = [];
  searchText: string = '';
  selectedType: string = 'All';
  selectedStatus: string = 'All';
  loading = false;

  constructor(
    private iconService: NzIconService,
    private billingsService: SubscriptionBillingsService,
    private message: NzMessageService
  ) {
    this.iconService.addIcon(...icons);
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    this.billingsService.getTransactionList().subscribe({
      next: (response: any) => {
        if (response.code === 200 && response.data.payments) {
          this.transactions = response.data.payments.map((txn: any) => ({
            id: txn.paymentId,
            tranNo: txn.paymentId,
            invoice: txn.invoiceNumber,
            type: txn.type.charAt(0).toUpperCase() + txn.type.slice(1),
            date: txn.date,
            status: txn.status.charAt(0).toUpperCase() + txn.status.slice(1),
            amount: txn.amount,
            color: txn.status === 'success' ? 'green' : 'red'
          }));
          this.applyFilter();
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading transactions:', error);
        this.message.error('Failed to load transactions');
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    let data = [...this.transactions];

    if (this.selectedType !== 'All') {
      data = data.filter(
        (x) => x.type.toLowerCase() === this.selectedType.toLowerCase()
      );
    }

    if (this.selectedStatus !== 'All') {
      data = data.filter(
        (x) => x.status.toLowerCase() === this.selectedStatus.toLowerCase()
      );
    }

    if (this.searchText.trim() !== '') {
      data = data.filter(
        (x) =>
          x.tranNo.toString().includes(this.searchText) ||
          x.invoice.toLowerCase().includes(this.searchText.toLowerCase()) ||
          x.amount.toString().includes(this.searchText)
      );
    }

    this.filteredTransactions = data;
  }
}
