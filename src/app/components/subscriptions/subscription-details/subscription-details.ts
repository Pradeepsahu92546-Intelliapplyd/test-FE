import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { SubscriptionBillingsService } from '../../../services/subscription-billings-service';

@Component({
  selector: 'app-subscription-details',
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzDividerModule,
  ],
  templateUrl: './subscription-details.html',
  styleUrl: './subscription-details.css',
})
export class SubscriptionDetails implements OnInit, OnChanges {
  @Input() unitName = '';
  @Input() subscriptionRow: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() upgrade = new EventEmitter<void>();

  details: any = null;
  isLoading = true;

  constructor(private billingService: SubscriptionBillingsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.load();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['unitName'] && this.unitName) {
      this.load();
    }
  }

  load(): void {
    this.isLoading = true;
    this.cdr.detectChanges(); // Force UI update to show loading state
    this.billingService.getSubscriptionDetails(this.unitName).subscribe({
      next: (res) => {
        this.details = res?.data ?? null;
        this.isLoading = false;
        this.cdr.detectChanges(); // Force UI update after data loads
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges(); // Force UI update on error
      },
    });
  }

  // Helper methods for template for status display
  statusColor(status: string): string {
    const map: Record<string, string> = {
      active: 'success',
      non_renewing: 'warning',
      cancelled: 'error',
      trial: 'processing',
      free: 'default',
    };
    return map[status?.toLowerCase()] ?? 'default';
  }

  // Format status string to be more user-friendly
  statusLabel(s: string): string {
    return s
      ? s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : '–';
  }

  // Format date string to a more readable format
  formatDate(d: string): string {
    if (!d) return '–';
    return new Date(d).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
