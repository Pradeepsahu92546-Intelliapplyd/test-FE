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
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { SubscriptionBillingsService } from '../../../services/subscription-billings-service';

export interface ActivityItem {
  activityId: string;
  description: string;
  activityTime: string;
  commentedBy: string;
}

@Component({
  selector: 'app-subscription-activities',
  imports: [CommonModule, NzIconModule, NzTimelineModule],
  templateUrl: './subscription-activities.html',
  styleUrl: './subscription-activities.css',
})
export class SubscriptionActivities implements OnInit, OnChanges {
  @Input() unitName = '';
  @Output() close = new EventEmitter<void>();

  activities: ActivityItem[] = [];
  isLoading = true;

  constructor(private billingService: SubscriptionBillingsService, private cdr: ChangeDetectorRef) {
    
  }

  ngOnInit(): void { this.load(); }
  ngOnChanges(changes: SimpleChanges): void { 
    if (changes['unitName'] && this.unitName) this.load(); 
  }

  load(): void {
    this.isLoading = true;
    this.cdr.detectChanges(); // Force UI update to show loading state
    this.billingService.getRecentActivities(this.unitName).subscribe({
      next: (res) => {
        // adapt camelCase or fallback
        this.activities = (res?.data ?? []).map((a: any) => ({
          activityId: a.activityId ?? a.activity_id,
          description: a.description,
          activityTime: a.activityTime ?? a.activity_time,
          commentedBy: a.commentedBy ?? a.commented_by,
        }));
        this.isLoading = false;
        this.cdr.detectChanges(); // Force UI update after data loads
      },
      error: () => { 
        this.isLoading = false;
        this.cdr.detectChanges(); // Force UI update on error
      },
    });
  }

  /** later it will replacing with pipe */
  getTitle(desc: string): string {
    if (!desc) return 'Activity';
    const lower = desc.toLowerCase();
    if (lower.includes('payment')) return 'Payment successful';
    if (lower.includes('reactivat') || lower.includes('no longer non-renewing')) return 'Subscription reactivated';
    if (lower.includes('cancel')) return 'Subscription cancelled';
    if (lower.includes('trial')) return 'Trial period started';
    if (lower.includes('created') || lower.includes('creat')) return 'Subscription created';
    if (lower.includes('upgraded')) return 'Subscription upgraded';
    return this.activities.find(a => a.description === desc)?.commentedBy ?? 'Comment By';
  }

  /** later it will replacing with pipe */
  getDotColor(desc: string): string {
    const lower = desc?.toLowerCase() ?? '';
    if (lower.includes('cancel')) return 'red';
    if (lower.includes('failed') || lower.includes('error')) return 'red';
    return 'green';
  }


  // later it will replacing with pipe
  formatDate(d: string): string {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  }
}











