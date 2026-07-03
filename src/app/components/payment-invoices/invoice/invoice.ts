import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { icons } from '../../../shared/icons-provider';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SubscriptionBillingsService } from '../../../services/subscription-billings-service';

import { InvoiceInf } from '../../../dto/interfaces/payment-invoice.interface';



@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzIconModule],
  templateUrl: './invoice.html',
  styleUrl: './invoice.css',
})
export class Invoice implements OnInit {
  invoice: undefined | any = [];
  invoiceId!: string;
  loading = false;

  constructor(
    private message: NzMessageService,
    private iconService: NzIconService,
    private route: ActivatedRoute,
    private router: Router,
    private billingsService: SubscriptionBillingsService
  ) {
    this.iconService.addIcon(...icons);
  }

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.paramMap.get('id')!;
    this.loadInvoiceDetails();
  }

  loadInvoiceDetails(): void {
    this.loading = true;
    this.billingsService.getInvoiceList().subscribe({
      next: (response) => {
        if (response.code === 200 && response.data.results) {
          const invoices = response.data.results;
          const match = invoices.find((inv: any) => inv.invoiceId === this.invoiceId);
          if (match) {
            this.invoice = {
              id: match.invoiceId,
              invoice: match.invoiceNumber,
              status: match.status.charAt(0).toUpperCase() + match.status.slice(1),
              amount: match.total,
              color: match.status === 'sent' ? 'gold' : (match.status === 'paid' ? 'green' : 'red'),
              metadata: {
                name: match.customer_name || '',
                invoicedate: match.invoice_date,
                dueDate: match.due_date,
                billingAddress: {
                  address: match.billingStreet || '',
                  city: match.billingCity || '',
                  state: match.billingState || '',
                  country: match.billingCountry || ''
                },
                shippingAddress: {
                  address: match.shippingStreet || '',
                  city: match.shippingCity || '',
                  state: match.shippingState || '',
                  country: match.shippingCountry || ''
                },
                item: [],
                paymentMode: 'online',
                cardNumber: ''
              }
            };
          } else {
            this.message.error('Invoice not found');
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading invoice:', error);
        this.message.error('Failed to load invoice details');
        this.loading = false;
      }
    });
  }
  goToInvoices() {
    this.router.navigate(['/invoices']);
  }
}
