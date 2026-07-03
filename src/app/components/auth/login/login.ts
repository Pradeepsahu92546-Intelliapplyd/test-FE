import {
  Component,
  EventEmitter,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormsModule,
  FormGroup,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';

/* AuthService auth/auth.service.ts */
import { Auth } from '../../../services/auth/auth';
import { icons } from '../../../shared/icons-provider';
import { Loader } from '../../../shared/components/modal/loader/loader';
import { InputDialog } from '../../../shared/components/modal/dialog/input-dialog/input-dialog';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NzInputModule,
    FormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzTypographyModule,
    NzIconModule,
    NzFormModule,
    Loader,
    InputDialog,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  @ViewChild(InputDialog) emailComp!: InputDialog;
  @Output() switchToRegister = new EventEmitter<void>();
  form: FormGroup;

  loading = signal(false);
  forgotPasswordLoading = signal(false);
  submitted = signal(false);
  passwordVisible = signal(false);

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    private notify: NzNotificationService,
    private iconService: NzIconService,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // agree: [true, Validators.requiredTrue],
    });

    this.iconService.addIcon(...icons);
  }

  // Toggle password visibility
  togglePassword() {
    this.passwordVisible.update((v) => !v);
  }

  // Handle form submission for login
  onSubmit() {
    this.submitted.set(true);
    if (this.form.invalid) return;

    const { email, password } = this.form.value;
    this.loading.set(true);

    this.auth.login(email!, password!).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        console.log('Response data code:', response.code);
        //  Check for the success code from the backend
        if (response.code === 200) {
          console.log('Login successful:', response);
          console.log('Response new data:', response.data.accessToken);
          console.log('Response email:', response.data.email);
          // Set the access token
          this.auth.setToken(response.data.accessToken);
          // Set the user email
          this.auth.setUserEmail(response.data.email);
          console.log('emailID new', this.auth.getUserEmail());
          this.loading.set(false);
          //  Use the message from the backend response
          this.notify.success(
            'Welcome',
            response.message || 'Logged in successfully',
          );
          // navigate into authenticated dashboard area after successful login
          this.router.navigateByUrl('/dashboard-home');
        } else {
          console.log(
            'Login response received with unexpected code:',
            response,
          );
          // Fallback for unexpected success responses
          this.loading.set(false);
          this.notify.info(
            'Info',
            response.message || 'Login completed with an unknown status.',
          );
        }
      },
      error: (err) => {
        this.loading.set(false);
       
        console.log('Angular Error status code1:', err.status);
        console.log('Custom Error status code1 2:', err.error.status);
        console.log('Angular Error status code new 1:', err.message);
        console.log('Custom Error status code new  2:', err.error.message);
        // Handle specific error codes
        if (err.error.code === 401) {
          this.notify.error(
            'Login Failed',
             err.error.message || 'Invalid email or password',
          );
        } else if (err.error.code === 403) {
          this.notify.error(
            'Login Failed',
            err.error.message ||
              'Your account is inactive. Please check your email for activation instructions.',
          );
        } else if (err.error.code === 500) {
          this.notify.error('Server Error', 'Please try again later');
        }
        else {
          console.log('Error message:', err.error.message);
          this.notify.error('Login Failed', err.error.message);
        }
      },
    });
  }

  // handle forget password logic to call email service api and show notification based on response (if user not login without token
  handleForgotPassword(email: string | undefined) {
    if (!email) {
      this.notify.error('Error', 'Please enter a valid email address');
      return;
    }

    this.forgotPasswordLoading.set(true);

    this.auth.forgotPasswordRequest(email).subscribe({
      next: (response) => {
        this.forgotPasswordLoading.set(false);
        this.notify.success(
          'Success',
          response.message || 'Password reset link sent to your email',
        );

        // Close the dialog
        this.emailComp.isVisible = false;
      },
      error: (err) => {
        this.forgotPasswordLoading.set(false);

        console.log('Angular Error status code1:', err.status);
        console.log('Custom Error status code1 2:', err.error.status);
        console.log('Angular Error status code new 1:', err.message);
        console.log('Custom Error status code new  2:', err.error.message);
        this.notify.error(
          'Error',
          err.error.message || 'Failed to send password reset link',
        );
      },
    });
  }

  openEmailConfirm() {
    this.emailComp.showModal();
  }
}
