import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-summary-card',
  imports: [NzDividerModule, NzButtonModule, NzCardModule],
  templateUrl: './summary-card.html',
  styleUrl: './summary-card.css'
})
export class SummaryCard {
  balanceAmount = 10000;
  tax = 1200;

  get total(): number {
    return this.balanceAmount + this.tax;
  }
  payNow() {
    console.log("Processing Payment...");
  }

}
