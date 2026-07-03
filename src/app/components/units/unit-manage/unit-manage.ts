import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitManagerSidenav } from '../../../shared/components/unit-manager-sidenav/unit-manager-sidenav';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-unit-manage',
  imports: [CommonModule, UnitManagerSidenav, RouterModule, RouterOutlet],
  templateUrl: './unit-manage.html',
  styleUrl: './unit-manage.css',
})
export class UnitManage {
constructor(private router: Router) {}

  // check if current url starts with /auth
  get isAuthRoute(): boolean {
    return this.router.url.startsWith('/auth');
  }
}
