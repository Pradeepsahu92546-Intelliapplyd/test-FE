import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { icons } from '../../../shared/icons-provider';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from '../../../services/user-service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Auth } from '../../../services/auth/auth';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzInputModule,
    NzDividerModule,
    NzIconModule,
    NzCardModule,
    NzTypographyModule,
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {
  passwordForm!: FormGroup;
  passwordVisible1 = false;
  passwordVisible2 = false;
  passwordVisible3 = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private iconService: NzIconService,
    private notification: NzNotificationService,
    private userService: UserService,
    private message: NzMessageService,
    private authService: Auth,
  ) {
    this.iconService.addIcon(...icons);
    this.initForm();
  }

  initForm() {
    this.passwordForm = this.fb.group(
      {
        currentPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
          ],
        ],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/), // strong password
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.matchPasswords },
    );
  }

  // Custom validator: confirmPassword === newPassword
  matchPasswords(group: AbstractControl): ValidationErrors | null {
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return newPass && confirmPass && newPass !== confirmPass
      ? { passwordMismatch: true }
      : null;
  }

  changePassword() {
    if (this.passwordForm.valid) {
      this.loading = true;
      const formData = this.passwordForm.value;
      this.userService
        .updatePassword({
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmNewPassword: formData.confirmPassword,
        })
        .subscribe({
          next: (response) => {
            if (response && response.message) {
              this.message.success('Password updated successfully');
              this.passwordForm.reset();
            }
            this.loading = false;
          },
          error: (error) => {
            console.error('Error updating password:', error);
            this.message.error('Failed to update password');
            this.loading = false;
          },
        });
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }
  createNotification(type: string): void {
    this.notification.create(
      type,
      'Password Changed Successfully',
      'Your password has changed',
    );
  }

  forgotPassword(): void {
    console.log('Forgot password clicked');
    // get currentlogin- user email-id
    const email = this.authService.getUserEmail();
    console.log('Current user email:', email);

    
    if (email) {
      this.authService.forgotPasswordRequest(email).subscribe({
        next: (response) => {
          console.log('Forgot password response:', response);
          if (response && response.message) {
            this.message.success('Password reset link sent to your email');
          } else {
            this.message.error('Failed to send password reset link');
          }
        },
        error: (error) => {
          console.error('Error sending forgot password request:', error);
          this.message.error(error.error.message || 'Failed to send password reset link');
        },
      });
         
    }
  }
}
