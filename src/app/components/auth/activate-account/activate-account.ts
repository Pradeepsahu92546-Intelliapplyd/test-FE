import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ResultConfirmation } from '../../../shared/components/results/result-confirmation/result-confirmation';
import { Auth } from '../../../services/auth/auth';

// Define a type for the page state
type PageState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-activate-account',
  imports: [CommonModule, NzSpinModule, ResultConfirmation],
  templateUrl: './activate-account.html',
  styleUrl: './activate-account.css',
})
export class ActivateAccount implements OnInit {

  state: PageState = 'loading';

  // Populated from success/error response — passed into ResultConfirmation
  resultTitle   = '';
  resultMessage = '';
  requestId     = '';
  timestamp     = '';

  constructor(
    private route:  ActivatedRoute,
    private router: Router,
    private auth:   Auth,
  ) {}

  ngOnInit(): void {
    // The activation link format from BE email:
    //   https://FE-domain/auth/activate-account/?token=<token>
    // Angular reads it via snapshot.queryParamMap
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.state         = 'error';
      this.resultTitle   = 'Invalid Activation Link';
      this.resultMessage = 'No activation token was found in the link. Please check your email and try again.';
      return;
    }

    this.activateAccount(token);
  }

  private activateAccount(token: string): void {
    this.state = 'loading';

    // GET /api/v1/accounts/activate/?token=<token>
    this.auth.activateAccount(token).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.state         = 'success';
          this.resultTitle   = response.message ?? 'Account Activated Successfully';
          this.resultMessage = 'Your account is ready. You can now log in and start using the platform.';
          this.requestId     = response.requestId ?? response.meta?.requestId ?? '';
          this.timestamp     = response.timestamp ?? response.meta?.timestamp ?? '';
        } else {
          this.setErrorState(response.message ?? 'Activation failed. Please try again.');
        }
      },
      error: (err) => {
        const msg =
          err.status === 400 ? 'This activation link is invalid or has already been used.' :
          err.status === 404 ? 'Activation token not found. Please request a new activation email.' :
          err.status === 410 ? 'This activation link has expired. Please request a new one.' :
          err.error?.message ?? 'Something went wrong. Please try again later.';
        this.setErrorState(msg);
      },
    });
  }

  private setErrorState(message: string): void {
    this.state         = 'error';
    this.resultTitle   = 'Activation Failed';
    this.resultMessage = message;
  }

  goToLogin(): void {
    this.router.navigate(['/auth']);
  }
}
