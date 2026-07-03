import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTabsModule } from 'ng-zorro-antd/tabs';  
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { icons } from '../../../shared/icons-provider';
import { SubscriptionBillingsService } from '../../../services/subscription-billings-service';
import { NzMessageService } from 'ng-zorro-antd/message';

import { InvoiceInf } from '../../../dto/interfaces/payment-invoice.interface';


@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [
    CommonModule,
    NzDropDownModule,
    NzIconModule,
    NzDividerModule,
    NzTableModule,
    NzTagModule,
    NzButtonModule,
    NzInputModule,
    NzProgressModule,
    NzTabsModule,  
    FormsModule
  ],
  templateUrl: './invoices.html',
  styleUrls: ['./invoices.css']
})
export class Invoices implements OnInit {
  invoceData: any[] = [];
  filteredData: any[] = [];
  selectedTabIndex: number = 0;
  searchText: string = '';
  loading = false;

  cardData = [
    {
      icon: 'file-text',
      color: '#1890FF',
      title: 'Total Invoice',
      price: 48000,
      bg: '#E6F7FF'
    },
    {
      icon: 'check-circle',
      color: 'green',
      title: 'Paid Invoices',
      price: 38400,
      bg: '#E6F6D6'
    },
    {
      icon: 'clock-circle',
      percentage: '20',
      color: '#ECDC26',
      title: 'Unpaid Invoices',
      price: 9600,
      bg: '#FEFFE6'
    }
  ];

  constructor(
    private iconService: NzIconService,
    private router: Router,
    private billingsService: SubscriptionBillingsService,
    private message: NzMessageService
  ) {
    this.iconService.addIcon(...icons);
  }

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading = true;
    this.billingsService.getInvoiceList().subscribe({
      next: (response) => {
        if (response.code === 200 && response.data.Invoices) {
          this.invoceData = response.data.Invoices.map((invoice: any) => ({
            id: invoice.invoiceId,
            invoice: invoice.invoiceNumber,
            status: invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1),
            amount: invoice.total,
            color: invoice.status === 'sent' ? 'gold' : (invoice.status === 'paid' ? 'green' : 'red'),
            metadata: {
              name: invoice.customerName || '',
              invoicedate: invoice.invoiceDate,
              dueDate: invoice.dueDate,
              billingAddress: {
                address: invoice.billingStreet || '',
                city: invoice.billingCity || '',
                state: invoice.billingState || '',
                country: invoice.billingCountry || ''
              },
              shippingAddress: {
                address: invoice.shippingStreet || '',
                city: invoice.shippingCity || '',
                state: invoice.shippingState || '',
                country: invoice.shippingCountry || ''
              },

              item: [],
              paymentMode: 'online',
              cardNumber: ''
            }
          }));
          this.applyFilter();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        this.message.error('Failed to load invoices');
        this.loading = false;
      }
    });
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    this.applyFilter();
  }

  onSearch(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    let data = [...this.invoceData];

    //  Filter by tab
    if (this.selectedTabIndex === 1) {
      data = data.filter(x => x.status.toLowerCase() === 'paid');
    } else if (this.selectedTabIndex === 2) {
      data = data.filter(x => x.status.toLowerCase() === 'unpaid');
    }

    // Filter by search
    if (this.searchText.trim() !== '') {
      data = data.filter(
        x =>
          x.invoice.toLowerCase().includes(this.searchText.toLowerCase()) ||
          x.amount.toString().includes(this.searchText)
      );
    }

    this.filteredData = data;
  }

  goToInvoice(id: any) {
  this.router.navigate(['/invoice', id]);
}

}
