import { Component } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { Invoices } from '../invoices/invoices';
import { Transactions } from '../transactions/transactions';
import { BillingList } from '../billing-list/billing-list';

@Component({
  selector: 'app-billing-landing',
  imports: [NzTabsModule, Invoices, Transactions, BillingList],
  templateUrl: './billing-landing.html',
  styleUrl: './billing-landing.css',
})
export class BillingLanding {
  activeTab = 0;
}
