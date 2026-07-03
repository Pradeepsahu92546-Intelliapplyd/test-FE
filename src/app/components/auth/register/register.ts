import { Component, EventEmitter, Output, signal, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  FormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth/auth';
import { CommonModule } from '@angular/common';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { icons } from '../../../shared/icons-provider';
import { Loader } from '../../../shared/components/modal/loader/loader';
import { AccountType } from '../../../dto/enums/account-type.enum';
import { UserType } from '../../../dto/enums/user-type.enum';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzCheckboxModule,
    NzIconModule,
    NzSpinModule,
    Loader,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register implements OnInit {
  @Output() switchToLogin = new EventEmitter<void>();

  loading = signal(false);
  passwordVisibleCreate  = false;
  passwordVisibleConfirm = false;
  form: FormGroup;

  // Fallback to local enum values until server metadata loads
  account_types: string[] = Object.values(AccountType);
  user_types:    string[] = Object.values(UserType);

  constructor(
    private fb:          FormBuilder,
    private auth:        Auth,
    private router:      Router,
    private notify:      NzNotificationService,
    private iconService: NzIconService,
  ) {
    this.iconService.addIcon(...icons);

    // Form controls keep snake_case for template binding — mapping happens at submit
    this.form = this.fb.group(
      {
        first_name:   ['', Validators.required],
        last_name:    ['', Validators.required],
        email:        ['', [Validators.required, Validators.email]],
        phone_number: ['', [Validators.required, Validators.pattern(/^(\+91)?[6-9]\d{9}$/)]],
        account_type: [AccountType.Standard, Validators.required],
        user_type:    [UserType.Individual,   Validators.required],
        password:     ['', [Validators.required, Validators.minLength(6)]],
        password2:    ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );

    // Re-validate confirm password whenever password changes
    this.form.get('password')?.valueChanges.subscribe(() => {
      this.form.get('password2')?.updateValueAndValidity({ emitEvent: false });
    });
  }

  ngOnInit(): void {
    // Fetch account & user type options from server
    this.auth.getAccountAndUserType().subscribe({
      next: (resp) => {
        const data = resp?.data ?? {};

        // ── FIX: service returns camelCase keys, not snake_case ──
        if (data.accountTypes?.length) {                  // ← was data.account_types
          this.account_types = data.accountTypes;
          this.form.get('account_type')?.setValue(data.accountTypes[0]);
        }
        if (data.userTypes?.length) {                     // ← was data.user_types
          this.user_types = data.userTypes;
          this.form.get('user_type')?.setValue(data.userTypes[0]);
        }
      },
      error: (err) => {
        console.error('Unable to load registration metadata — using local defaults', err);
        // Local enum fallbacks already set in constructor, so UI still works
      },
    });
  }

  passwordMatchValidator = (control: AbstractControl): ValidationErrors | null => {
    const password  = control.get('password')?.value;
    const password2 = control.get('password2')?.value;
    if (!password || !password2) return null;
    return password === password2 ? null : { passwordMismatch: true };
  };

  togglePasswordCreate():  void { this.passwordVisibleCreate  = !this.passwordVisibleCreate; }
  togglePasswordConfirm(): void { this.passwordVisibleConfirm = !this.passwordVisibleConfirm; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const f = this.form.value;

    // ── FIX: map form's snake_case controls → RegisterRequest camelCase fields ──
    const payload = {
      firstName:   f.first_name,    
      lastName:    f.last_name,     
      email:       f.email,
      phoneNumber: f.phone_number,  
      accountType: f.account_type,  
      userType:    f.user_type,     
      password:    f.password,
      password2:   f.password2,
    };

    this.auth.register(payload).subscribe({
      next: (response) => {
        if (response.code === 201) {
          this.loading.set(false);
          this.notify.success('Success', response.message ?? 'Registration successful');
          this.auth.setUserEmail(f.email);
          this.router.navigate(['/auth/verify-email'], {
            queryParams: { email: f.email },
          });
        } else {
          this.loading.set(false);
          this.notify.success('Success', 'Registration completed');
        }
      },
      error: (err) => {
        this.loading.set(false);
        console.log('Angular Error status code1:', err.status);
        console.log('Custom Error status code1 2:', err.error.status);
        console.log('Angular Error status code new 1:', err.message);
        console.log('Custom Error status code new  2:', err.error.message);


        if (err.error.code === 400) {
          this.notify.error('Registration Failed', err.error?.message ?? 'Invalid registration data');
        } else if (err.error.code === 409) {
          this.notify.error('Registration Failed', 'Email already exists');
        } else if (err.error.code === 500) {
          this.notify.error('Server Error', 'Please try again later');
        } else {
          this.notify.error('Registration Failed', err?.message ?? 'An unexpected error occurred');
        }
      },
    });
  }
}