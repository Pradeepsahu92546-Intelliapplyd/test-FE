import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SubscriptionCard,
  BillingPeriod,
} from '../../../shared/components/subscription-card/subscription-card';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router'; 

import { Loader } from '../../../shared/components/modal/loader/loader';

@Component({
  selector: 'app-subscriptions-pricing',
  imports: [CommonModule, SubscriptionCard, Loader],
  templateUrl: './subscriptions-pricing.html',
  styleUrl: './subscriptions-pricing.css',
})
export class SubscriptionsPricing {
  loading = signal(false);

   constructor(private router: Router,private notify: NzNotificationService) {} 


  proBilling = signal<BillingPeriod>('monthly');
  paygBilling = signal<BillingPeriod>('monthly');



  proFeatures = [
    'benefit description',
    'benefit description',
    'benefit description',
    'benefit description',
    'benefit description',
  ];

  paygFeatures = [
    'benefit description',
    'benefit description',
    'benefit description',
    'benefit description',
    'benefit description',
  ];

  onSelect(plan: 'free' | 'pro' | 'payg') {
    // handle plan selection here (navigate, open checkout, call API, etc.)
    // navigate to addon page
    this.loading.set(true); // show loader
  setTimeout(() => {
    this.router.navigate(['/auth/select-addons']).then(() => {
      setTimeout(() => {
        this.loading.set(false);
        this.notify.success(`You selected ${plan} plan`, 'Plan selection successful');
      }, 1500);
    });
  }, 1000);
  }
}
