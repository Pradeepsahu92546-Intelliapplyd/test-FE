import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SubscriptionBillingsService } from '../../../services/subscription-billings-service';
import { BillingItem } from '../../../dto/interfaces/billing.interface';

@Component({
  selector: 'app-billing-list',
  imports: [
    CommonModule,
    NzCardModule,
    NzTagModule,
    NzButtonModule,
    NzSkeletonModule,
    NzDividerModule,
    NzIconModule,
  ],
  templateUrl: './billing-list.html',
  styleUrl: './billing-list.css',
})
export class BillingList implements OnInit {
  billings: BillingItem[] = [];
  isLoading = true;
  error = '';

  // Fallback billing address (from API addr field, or default)
  defaultAddress : string = '';

  constructor(private billingService: SubscriptionBillingsService) {}

  ngOnInit(): void {
    this.billingService.getBillingList().subscribe({
      next: (res) => {
        this.billings = res?.data?.billings ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load billing data.';
        this.isLoading = false;
      },
    });
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'paid':      return 'success';
      case 'pending':   return 'warning';
      case 'failed':    return 'error';
      case 'cancelled': return 'default';
      default:          return 'warning';
    }
  }

  getStatusLabel(status: string): string {
    if (!status) return '–';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  formatDate(date: string | null): string {
    if (!date) return '–';
    return date;
  }

  formatAmount(amount: number): string {
    return `₹ ${amount.toLocaleString('en-IN')}`;
  }

  getBillingAddress(addr: string): string {
    return addr?.trim() ? addr : this.defaultAddress;
  }

  // Derive subscription status from is_recurring flag
  getSubStatus(item: BillingItem): string {
    return item.isRecurring ? 'Non_renewing' : 'Active';
  }

  onPay(billing: BillingItem): void {
    console.log('Pay billing:', billing.id);
    // Integrate payment gateway here
  }
}
