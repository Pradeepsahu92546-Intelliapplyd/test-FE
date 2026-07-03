import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidenav } from '../../../shared/components/profile-sidenav/sidenav';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-account-setting-landing',
  imports: [CommonModule, Sidenav, RouterModule, RouterOutlet],
  templateUrl: './account-setting-landing.html',
  styleUrl: './account-setting-landing.css',
})
export class AccountSettingLanding {
     constructor(private router: Router) {}

  // check if current url starts with /auth
  get isAuthRoute(): boolean {
    return this.router.url.startsWith('');
  }
  
}
