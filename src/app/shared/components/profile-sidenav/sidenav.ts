import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconService } from 'ng-zorro-antd/icon';
import { RouterModule } from '@angular/router';
import { icons } from '../../icons-provider';
import { CommonModule } from '@angular/common';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Router } from '@angular/router';
import { UserHeader } from '../global/user-header/user-header';
import { Auth } from '../../../services/auth/auth';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  imports: [
    CommonModule,
    RouterModule,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzMenuModule,
    NzAvatarModule,
    NzButtonModule,
    NzTooltipModule,
    NzDividerModule,
    RouterModule,
    UserHeader
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
})
export class Sidenav {
 isCollapsed = false;
 private subs = new Subscription();

  menuItems = [
    { label: 'Profile',               icon: 'user',     link: '/user/profile'    },
    { label: 'Account Settings',      icon: 'solution', link: '/user/account'    },
    { label: 'Security',              icon: 'lock',     link: '/user/security'   },
    { label: 'Preferences Settings',  icon: 'bell',     link: '/user/preference' },
    { label: 'Help & supports',       icon: 'message',  link: '/user/help'       },
  ];

  constructor(private iconService: NzIconService,private authService: Auth, private notification: NzNotificationService, private router: Router ) {
    this.iconService.addIcon(...icons);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  goBack(): void {
    // navigatr to dashborad home
     this.router.navigate(['/dashboard-home']);
  }

  logout(): void {
    console.log('Logout clicked');
    this.router.navigate(['/auth']);   
    this.subs.add(
      this.authService.logout().subscribe({
        next: () => {
          this.authService.setToken('');
          this.authService.setUserEmail('');
          this.authService.isUserAuthenticated.set(false);
        },
        error: (err) => {
          console.error('Logout failed', err);
          this.notification.error('Error', 'Logout failed. Please try again.');
        },
      })
    );
  }

}


 // {
    //   title: 'Organization',
    //   icon: 'apartment',
    //   open: false,
    //   items: [
    //     { label: 'Team', link: '/team' },
    //     { label: 'Members', link: '/member' },
    //     { label: 'Rules', link: '/rules' },
    //     { label: 'Permissions', link: '/permissions' },
    //   ],
    // },
    // {
    //   title: 'Payments',
    //   icon: 'credit-card',
    //   open: false,
    //   items: [
    //     { label: 'Payment Method', link: '/payment-method' },
    //     { label: 'Transaction History', link: '/transaction-history' },
    //     { label: 'Invoces', link: '/invoices' },
    //   ],
    // },
    // {
    //   title: 'Subscription',
    //   icon: 'dollar',
    //   open: false,
    //   items: [{ label: 'Billing', link: '/billing' },
    //     { label: 'Subscriptions', link: '/subscriptions' }
    //   ],
    // },
    // {
    //   title: 'Help & Support',
    //   icon: 'question-circle',
    //   open: false,
    //   items: [{ label: 'Ticket', link: '/ticket' }],
    // },