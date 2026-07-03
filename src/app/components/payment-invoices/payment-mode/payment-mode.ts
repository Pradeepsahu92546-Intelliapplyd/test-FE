import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Cards } from '../cards/cards';
import { SummaryCard } from '../summary-card/summary-card';
import { Upi } from '../upi/upi';
@Component({
  selector: 'app-payment-mode',
  standalone: true,
  imports: [
    CommonModule,
    NzTabsModule,
    NzButtonModule,
    NzCardModule,
    NzDividerModule,
    NzIconModule,
    NzTagModule,
    Cards,
    SummaryCard,
    Upi
  ],
  templateUrl: './payment-mode.html',
  styleUrl: './payment-mode.css'
})
export class PaymentMode {
  
 

  
  

  
}
