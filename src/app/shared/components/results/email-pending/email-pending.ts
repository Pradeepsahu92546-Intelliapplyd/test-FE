import { Component, OnInit , signal} from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzIconService } from 'ng-zorro-antd/icon';
import { icons } from '../../../icons-provider';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '../../../../services/auth/auth';
import { CommonModule } from '@angular/common';
import { Loader } from '../../modal/loader/loader';

@Component({
  selector: 'app-email-pending',
  imports: [NzButtonModule, NzResultModule, CommonModule,Loader],
  templateUrl: './email-pending.html',
  styleUrl: './email-pending.css'
})
export class EmailPending implements OnInit {
  userEmail: string = '';
  loading = signal(false);

  constructor(
    private iconService: NzIconService, 
    private router: Router, 
    private notify: NzNotificationService,
    private route: ActivatedRoute,
    private auth: Auth // Inject Auth service
  ) {
    this.iconService.addIcon(...icons);
  }

  ngOnInit() {
    // Get the email from query parameters or from auth service
    this.route.queryParams.subscribe(params => {
      this.userEmail = params['email'] || '';
    });

    // If no email in query params, try to get it from auth service
    if (!this.userEmail) {
      const email = this.auth.getUserEmail();
      if (email) {
        this.userEmail = email;
      }
    }
  }

  resendActivationLink() {
    if (!this.userEmail) {
      this.notify.error('Error', 'Email address is required');
      return;
    }

    this.loading.set(true);

    const verificationToken = this.auth.getVerificationToken();
    this.auth.resendActivationLink(this.userEmail, verificationToken).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.code === 200) {
          this.notify.success('Success', `Activation link resent to ${this.userEmail}`);
        } else {
          this.notify.warning('Notice', response.message);
        }
      },
      error: (err) => {
        this.loading.set(false);
        if (err.code === 400) {
          this.notify.error('Error', err.message || 'Account already activated');
        } else {
          this.notify.error('Error', err?.message || 'Failed to resend activation link');
        }
      }
    });
  }
}