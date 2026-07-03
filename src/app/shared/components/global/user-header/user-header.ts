import {
  Component, OnInit, OnDestroy, Input,
  ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import { CommonModule }       from '@angular/common';
import { NzAvatarModule }     from 'ng-zorro-antd/avatar';
import { NzDropDownModule }   from 'ng-zorro-antd/dropdown';
import { NzMenuModule }       from 'ng-zorro-antd/menu';
import { NzIconModule }       from 'ng-zorro-antd/icon';
import { NzToolTipModule }    from 'ng-zorro-antd/tooltip';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router }             from '@angular/router';
import { Subscription }       from 'rxjs';

import { UserService } from '../../../../services/user-service';
import { Auth }        from '../../../../services/auth/auth';
import { ProfileModel } from '../../../../dto/models/user-profile.model';

const DEFAULT_AVATAR =
  'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80';



@Component({
  selector: 'app-user-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, NzAvatarModule, NzDropDownModule,
    NzMenuModule, NzIconModule, NzToolTipModule,
  ],
  templateUrl: './user-header.html',
  styleUrl:    './user-header.css',
})
export class UserHeader implements OnInit, OnDestroy {
  @Input() isCollapsed = false;

  name:       string = '';
  email:      string = '';
  profileImg: string = DEFAULT_AVATAR;

  private subs = new Subscription();

  onAvatarError(): void {
    if (this.profileImg !== DEFAULT_AVATAR) {
      this.profileImg = DEFAULT_AVATAR;
      this.cdr.markForCheck();
    }
  }

  constructor(
    private authService:  Auth,
    private userService:  UserService,
    private router:       Router,
    private notification: NzNotificationService,
    private cdr:          ChangeDetectorRef,
  ) {}

  ngOnInit(): void { this.loadUserProfile(); }
  ngOnDestroy(): void { this.subs.unsubscribe(); }

  private loadUserProfile(): void {
    this.subs.add(
      this.userService.getProfile().subscribe(result => {
        if (result.ok) {
          // result.data is typed ProfileModel — no raw BE fields here
          const p: ProfileModel = result.data;
          this.name       = `${p.firstName} ${p.lastName}`.trim();
          this.email      = p.email;
          this.profileImg = p.profileImage || DEFAULT_AVATAR;
        } else {
          // result.error.message already human-readable
          this.notification.error('Error', result.error.message);
        }
        this.cdr.markForCheck();
      })
    );
  }

  navigateToProfile(): void {
    this.router.navigate(['/user/profile']);
  }

  navigateToAccount(): void {
    this.router.navigate(['/user/profile']);
  }

  navigateToManage(): void {
    this.router.navigate(['manage/units']);
  }

  navigateToInvite(): void {
    this.router.navigate(['']);
  }

  logout(): void {
    this.subs.add(
      this.authService.logout().subscribe({
        next: (res: { message?: string }) => {
          this.authService.setToken('');
          this.authService.setUserEmail('');
          this.authService.isUserAuthenticated.set(false);
          this.router.navigate(['/auth']);
          // notification handled in auth service logout() method after successful API call
          this.notification.success('Logged out', res.message || 'You have been logged out successfully.' );
        },
        error: (err) => {
          console.error('Logout failed', err);
          this.notification.error('Error', 'Logout failed. Please try again.');
        },
      })
    );
  }
}
