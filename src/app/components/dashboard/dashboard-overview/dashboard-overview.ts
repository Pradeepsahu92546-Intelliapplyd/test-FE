import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { icons } from '../../../shared/icons-provider';

@Component({
  selector: 'app-dashboard-overview',
  imports: [
     CommonModule,
    NzButtonModule,
    NzIconModule,
    NzTabsModule,
    NzEmptyModule,
    NzCardModule,
    NzBadgeModule,
    NzDividerModule,
    NzTypographyModule,
  ],
  templateUrl: './dashboard-overview.html',
  styleUrl: './dashboard-overview.css',
})
export class DashboardOverview {

  constructor(private iconService: NzIconService) {
    this.iconService.addIcon(...icons);
  }
}
