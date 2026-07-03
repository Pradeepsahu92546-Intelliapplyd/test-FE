import { Component, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule } from '@angular/forms';
import { NzIconService } from 'ng-zorro-antd/icon';
import { icons } from '../../../shared/icons-provider';
import { NgFor } from '@angular/common';


type Period = 'monthly' | 'annual';


interface Addon {
  id: string;
  name: string;
  pricePerMonth: number; // base price per 1 unit per month
  details: string;
  icon?: string;
}
interface ChosenAddon {
  id: string;
  quantity: number;
}


@Component({
  selector: 'app-select-addon',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NzStepsModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
    NzSwitchModule,
    NzDividerModule,
    NzTableModule,
  ],
  templateUrl: './select-addon.html',
  styleUrl: './select-addon.css',
})
export class SelectAddon {
  // Top state
  selectedOrg: string | null = null;
  orgs = ['Acme Corp', 'Globex', 'Innotech'];
  autoRenew = true;
  period = signal<Period>('monthly');


  constructor(private iconService: NzIconService) {
    this.iconService.addIcon(...icons);
  }


  // Base pro plan pricing
  proMonthly = 1999; // example
  proLine = computed(() =>
    this.period() === 'annual' ? this.proMonthly * 12 : this.proMonthly
  );


  // Addons catalog
  addons: Addon[] = [
    {
      id: 'a1',
      name: 'Addon name',
      pricePerMonth: 199,
      details: 'Addons details',
    },
    {
      id: 'a2',
      name: 'Addon name',
      pricePerMonth: 99,
      details: 'Addons details',
    },
  ];
  qtyOptions = [0, 1, 2, 3, 4, 5, 10];


  chosen = signal<ChosenAddon[]>([
    { id: 'a1', quantity: 0 },
    { id: 'a2', quantity: 0 },
  ]);


  getQty(id: string) {
    return this.chosen().find((x) => x.id === id)?.quantity ?? 0;
  }
  setQty(id: string, q: number) {
    this.chosen.update((list) =>
      list.map((x) => (x.id === id ? { ...x, quantity: q } : x))
    );
  }


  add(id: string) {
    // set default quantity to 1 when first adding
    if (this.getQty(id) === 0) this.setQty(id, 1);
  }


  increment(id: string) {
    const current = this.getQty(id);
    this.setQty(id, current + 1);
  }
  remove(id: string) {
    this.setQty(id, 0);
  }


  // Addons totals
  addonMonthlyTotal = computed(() =>
    this.chosen().reduce((sum, c) => {
      const a = this.addons.find((z) => z.id === c.id);
      return a ? sum + a.pricePerMonth * c.quantity : sum;
    }, 0)
  );
  addonsLine = computed(() =>
    this.period() === 'annual'
      ? this.addonMonthlyTotal() * 12
      : this.addonMonthlyTotal()
  );


  subtotal = computed(() => this.proLine() + this.addonsLine());


  // --- Billing detail lines (each selected add-on)
  detailAddons = computed(() => {
    const period = this.period();
    const multiplier = period === 'annual' ? 12 : 1;
    const suffix = period === 'annual' ? '/yr' : '/mo';


    return this.chosen()
      .filter(c => c.quantity > 0)
      .map(c => {
        const a = this.addons.find(z => z.id === c.id)!;
        const unit = a.pricePerMonth;
        const total = unit * c.quantity * multiplier;
        return {
          id: a.id,
          name: a.name,
          qty: c.quantity,
          unit,           // monthly unit price
          total,          // per selected period
          suffix          // '/mo' or '/yr' for display
        };
      });
  });


  next() {
    // navigate to payment or emit event
    console.log('Proceed to payment details', {
      org: this.selectedOrg,
      autoRenew: this.autoRenew,
      period: this.period(),
      chosen: this.chosen(),
      subtotal: this.subtotal(),
    });
  }
  goBack() {
    history.back();
  }
}



