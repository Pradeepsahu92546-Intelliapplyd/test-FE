// components/subscriptions/subscription-list/subscription-list.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTooltipComponent, NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SubscriptionDetails } from '../subscription-details/subscription-details';
import { SubscriptionActivities } from '../subscription-activities/subscription-activities';
import { SubscriptionBillingsService } from '../../../services/subscription-billings-service';
import { icons } from '../../../shared/icons-provider';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Confirmation } from '../../../shared/components/modal/dialog/confirmation/confirmation';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface SubscriptionRow {
  id: string;
  unit: string;
  subscriptionId: string;
  plan: string;
  planCode: string;
  status: string;
  amount: number;
  startDate: string;
  nextBilling: string;
  autoRenew: boolean;
  raw: any;
}

@Component({
  selector: 'app-subscription-list',
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzTagModule,
    NzDropDownModule,
    NzMenuModule,
    NzSelectModule,
    NzModalModule,
    NzToolTipModule,
    SubscriptionDetails,
    SubscriptionActivities,
    Confirmation,
  ],
  templateUrl: './subscription-list.html',
  styleUrl: './subscription-list.css',
})
export class SubscriptionList implements OnInit {
  subscriptions: SubscriptionRow[] = [];
  filteredSubscriptions: SubscriptionRow[] = [];
  isLoading = true;

  searchText = '';
  statusFilter = 'all';

  // Confirmation dialog ref
  @ViewChild('confirmDialog') confirmDialog!: Confirmation;

  // Drawer state — overlay, no layout shift
  detailsVisible = false;
  activitiesVisible = false;

  /** True while the drawer is mounted but animating closed */
  drawerClosing = false;

  statusDropVisible: boolean = false;
  selectedUnit = '';
  selectedSub: SubscriptionRow | null = null;

  // Pagination
  pageIndex = 1;
  pageSize = 10;

  readonly STATUS_OPTIONS = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Live', value: 'live' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Free', value: 'free' },
    { label: 'Expired', value: 'expired' },
  ];

  constructor(
    private billingService: SubscriptionBillingsService,
    private message: NzMessageService,
    private iconsservice: NzIconService,
    private notification: NzNotificationService,
    private router: Router,
  ) {
    this.applyFilters();
  }

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.isLoading = true;
    this.billingService.getSubscriptionList().subscribe({
      next: (res) => {
        const raw: any[] = res?.data?.subs ?? [];
        this.subscriptions = raw.map((s, i) => this.mapRow(s, i));
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.message.error('Failed to load subscriptions');
        this.isLoading = false;
      },
    });
  }

  private mapRow(s: any, index: number): SubscriptionRow {
    const [planName, planCode] = this.parsePlan(s.plan);
    return {
      id: s.id,
      unit: s.unit,
      subscriptionId: s.id,
      plan: planName,
      planCode: planCode,
      status: s.status ?? 'active',
      amount: s.amount,
      startDate: s.startDate ?? s.start_date,
      nextBilling: s.endDate ?? s.end_date,
      autoRenew: s.status === 'active',
      raw: s,
    };
  }

  private parsePlan(plan: string): [string, string] {
    if (!plan) return ['–', '–'];
    const parts = plan.split('(');
    const name = parts[0].trim();
    const code = parts[1]
      ? parts[1].replace(')', '').trim().toLowerCase().replace(/\s+/g, '-')
      : 'standard';
    return [name, code];
  }

  applyFilters(): void {
    this.filteredSubscriptions = this.subscriptions.filter((s) => {
      const matchSearch =
        !this.searchText ||
        s.unit.toLowerCase().includes(this.searchText.toLowerCase()) ||
        s.subscriptionId.includes(this.searchText) ||
        s.plan.toLowerCase().includes(this.searchText.toLowerCase());
      const st = s.status?.toLowerCase() || '';
      const matchStatus =
        this.statusFilter === 'all' || st === this.statusFilter;
      return matchSearch && matchStatus;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }
  onStatusChange(): void {
    this.applyFilters();
  }

  // ── Drawer openers ──────────────────────────────────────────────

  /** Shared helper: set context and open the overlay */
  private openDrawer(sub: SubscriptionRow, panel: 'details' | 'activities'): void {
    this.selectedSub = sub;
    this.selectedUnit = sub.unit;
    this.drawerClosing = false;

    if (panel === 'details') {
      this.detailsVisible = true;
      this.activitiesVisible = false;
    } else {
      this.activitiesVisible = true;
      this.detailsVisible = false;
    }
  }

  openDetails(sub: SubscriptionRow): void {
    this.openDrawer(sub, 'details');
  }

  openActivities(sub: SubscriptionRow): void {
    this.openDrawer(sub, 'activities');
  }

  /**
   * Animate the drawer out, then unmount after the transition completes.
   * 300 ms matches the CSS transition duration.
   */
  closeDrawer(): void {
    this.drawerClosing = true;
    setTimeout(() => {
      this.detailsVisible = false;
      this.activitiesVisible = false;
      this.drawerClosing = false;
    }, 300);
  }

  closeDetails(): void {
    this.closeDrawer();
  }
  closeActivities(): void {
    this.closeDrawer();
  }

  // ── Actions ─────────────────────────────────────────────────────

  private statusLower(s: string | undefined): string {
    return (s || '').toLowerCase();
  }

  canCancel(sub: SubscriptionRow): boolean {
    const st = this.statusLower(sub.status);
    return ['active', 'non_renewing', 'live'].includes(st);
  }
  canReactivate(sub: SubscriptionRow): boolean {
    return this.statusLower(sub.status) === 'cancelled';
  }
  canDelete(sub: SubscriptionRow): boolean {
    const st = this.statusLower(sub.status);
    return ['cancelled', 'expired'].includes(st);
  }

  onCancel(sub: SubscriptionRow): void {
    this.confirmDialog.title = 'Cancel Subscription';
    this.confirmDialog.content = `Are you sure you want to cancel the subscription for ${sub.unit}?`;
    this.confirmDialog.okColor = true;
    this.confirmDialog.showConfirm();
    this.confirmDialog.confirmed.pipe(take(1)).subscribe(() => {
      this.billingService.cancelSubscription(sub.unit).subscribe({
        next: () => {
          this.notification.success('Cancelled', `Subscription for ${sub.unit} has been cancelled.`);
          this.loadSubscriptions();
        },
        error: () =>
          this.notification.error(
            'Cancellation Failed',
            `Failed to cancel subscription for ${sub.unit}. Please try again.`,
          ),
      });
    });
  }

  onReactivate(sub: SubscriptionRow): void {
    this.confirmDialog.title = 'Reactivate Subscription';
    this.confirmDialog.content = `Are you sure you want to reactivate the subscription for ${sub.unit}?`;
    this.confirmDialog.okColor = false;
    this.confirmDialog.showConfirm();
    this.confirmDialog.confirmed.pipe(take(1)).subscribe(() => {
      this.billingService.reactivateSubscription(sub.unit).subscribe({
        next: () => {
          this.notification.success('Reactivated', `Subscription for ${sub.unit} has been reactivated.`);
          this.loadSubscriptions();
        },
        error: () =>
          this.notification.error(
            'Reactivation Failed',
            `Failed to reactivate subscription for ${sub.unit}. Please try again.`,
          ),
      });
    });
  }

  onDelete(sub: SubscriptionRow): void {
    this.confirmDialog.title = 'Delete Subscription';
    this.confirmDialog.content = `Are you sure you want to delete the subscription for ${sub.unit}? This action cannot be undone.`;
    this.confirmDialog.okColor = true;
    this.confirmDialog.showConfirm();
    this.confirmDialog.confirmed.pipe(take(1)).subscribe(() => {
      this.billingService.deleteSubscription(sub.unit).subscribe({
        next: () => {
          this.notification.success('Deleted', `Subscription for ${sub.unit} has been deleted.`);
          this.loadSubscriptions();
        },
        error: () =>
          this.notification.error(
            'Deletion Failed',
            `Failed to delete subscription for ${sub.unit}. Please try again.`,
          ),
      });
    });
  }

  onUpgrade(sub: SubscriptionRow): void {
    this.router.navigateByUrl('/subscriptions-pricing');
    this.message.info(`Your current plan ${sub.plan} for ${sub.unit}, upgrade options will be available soon!`);
  }

  newSubscription(): void {
    this.router.navigateByUrl('/subscriptions-pricing');
    this.message.info('Choose a plan to create a new subscription');
  }

  // ── Display helpers ──────────────────────────────────────────────

  statusColor(status: string): string {
    const map: Record<string, string> = {
      active: 'success',
      non_renewing: 'warning',
      cancelled: 'error',
      trial: 'processing',
      free: 'default',
      expired: 'default',
    };
    return map[status?.toLowerCase()] ?? 'default';
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      active: 'Active',
      non_renewing: 'Non Renewing',
      cancelled: 'Cancelled',
      trial: 'Trial',
      free: 'Free',
      expired: 'Expired',
    };
    return map[status?.toLowerCase()] ?? status;
  }

  formatAmount(n: number): string {
    return n === 0 ? 'Free' : `₹ ${n.toLocaleString('en-IN')}`;
  }

  /** Whether any drawer panel is currently visible (open or animating closed) */
  get isDrawerOpen(): boolean {
    return this.detailsVisible || this.activitiesVisible;
  }
}