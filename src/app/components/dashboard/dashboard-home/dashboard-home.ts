import { Component } from '@angular/core';
import { MainSideNav } from '../../../shared/components/landing-side-nav/main-side-nav';
import { DashboardOverview } from '../dashboard-overview/dashboard-overview';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-home',
  imports: [
     CommonModule,
    NzLayoutModule,
    MainSideNav,
    DashboardOverview
  ],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css',
})
export class DashboardHome {

}
