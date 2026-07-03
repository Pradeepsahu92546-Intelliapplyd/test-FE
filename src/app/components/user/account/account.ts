import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import { CommonModule }       from '@angular/common';
import { NzSelectModule }     from 'ng-zorro-antd/select';
import { NzCardModule }       from 'ng-zorro-antd/card';
import { NzSwitchModule }     from 'ng-zorro-antd/switch';
import { NzSkeletonModule }   from 'ng-zorro-antd/skeleton';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription }       from 'rxjs';

import { AccountManagement }  from '../account-management/account-management';
import { Email }              from '../email/email';
import { UserService }        from '../../../services/user-service';
import { ProfileModel } from '../../../dto/models/user-profile.model';

@Component({
  selector: 'app-account',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    Email,
    AccountManagement,
    NzCardModule,
    NzSelectModule,
    NzSwitchModule,
    NzSkeletonModule,
  ],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit, OnDestroy {
  accountType  = '';
  userType     = '';
  isLoading    = true;
  errorMessage = '';

  private subs = new Subscription();

  constructor(
    private userService: UserService,
    private cdr:         ChangeDetectorRef,
    private notify:      NzNotificationService,
  ) {}

  ngOnInit(): void    { this.loadUserProfile(); }
  ngOnDestroy(): void { this.subs.unsubscribe(); }

  loadUserProfile(): void {
    this.isLoading    = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.subs.add(
      this.userService.getProfile().subscribe(result => {
        if (result.ok) {
          // result.data is typed ProfileModel — use clean field names
          const p: ProfileModel = result.data;
          this.accountType = p.accountType;   
          this.userType    = p.userType;       
        } else {
          // result.error.message is already human-readable from mapHttpError()
          this.errorMessage = result.error.message;
          this.notify.error('Error', result.error.message);  
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      })
    );
  }
}