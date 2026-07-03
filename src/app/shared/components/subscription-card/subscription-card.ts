import {
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';

export type BillingPeriod = 'monthly' | 'annual';

@Component({
  selector: 'app-subscription-card',
  imports: [
    CommonModule,
    NzButtonModule,
    NzTagModule,
    NzIconModule,
    NzRadioModule,
    FormsModule,
    NzDividerModule,FormsModule
  ],
  templateUrl: './subscription-card.html',
  styleUrl: './subscription-card.css',
})
export class SubscriptionCard {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() recommended = false;
  @Input() showPrice = true; // New input to control price display

  @Input() showBillingToggle = false;
  @Input() price: string | null = null; // e.g., 'XXXX'
  @Input() billing: BillingPeriod = 'monthly';
  @Output() billingChange = new EventEmitter<BillingPeriod>();

  @Input() features: string[] = [];
  @Input() ctaText = 'Choose plan';
  @Input() ctaDisabled = false;
  @Output() select = new EventEmitter<void>();

  periodLabel = computed(() => (this.billing === 'annual' ? 'year' : 'month'));

  onBillingChange(val: BillingPeriod) {
    this.billing = val;
    this.billingChange.emit(val);
  }
}