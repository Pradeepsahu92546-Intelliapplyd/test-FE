import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule, ReactiveFormsModule,
  FormBuilder, FormGroup, Validators,
} from '@angular/forms';
import { NzButtonModule }      from 'ng-zorro-antd/button';
import { NzDatePickerModule }  from 'ng-zorro-antd/date-picker';
import { NzInputModule }       from 'ng-zorro-antd/input';
import { NzSelectModule }      from 'ng-zorro-antd/select';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzMessageService }    from 'ng-zorro-antd/message';
import { NzSkeletonModule }    from 'ng-zorro-antd/skeleton';
import { Subscription }        from 'rxjs';

import { icons }       from '../../../shared/icons-provider';
import { UserService } from '../../../services/user-service';
import { ProfileModel } from '../../../dto/models/user-profile.model';

@Component({
  selector: 'app-profileform',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NzButtonModule, NzInputModule, NzDatePickerModule,
    NzSelectModule, NzIconModule, NzSkeletonModule,
  ],
  templateUrl: './profile-form.html',
  styleUrls:   ['./profile-form.css'],
})
export class ProfileForm implements OnInit, OnDestroy {
  profileForm!: FormGroup;

  isEditingBasic = false;
  isEditingPhone = false;
  isSavingBasic  = false;
  isSavingPhone  = false;
  isLoading      = true;
  errorMessage   = '';          // ← surface ApiError.message in template if needed

  private subs = new Subscription();

  constructor(
    private fb:          FormBuilder,
    private iconService: NzIconService,
    private userService: UserService,
    private message:     NzMessageService,
    private cdr:         ChangeDetectorRef,
  ) {
    this.iconService.addIcon(...icons);
    this.initForm();
  }

  ngOnInit(): void { this.loadUserProfile(); }
  ngOnDestroy(): void { this.subs.unsubscribe(); }

  private initForm(): void {
    this.profileForm = this.fb.group({
      firstName:   [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]],
      lastName:    [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]],
      dob:         [{ value: null, disabled: true }, Validators.required],
      phone:       [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]{8,12}$/)]],
      countryCode: [{ value: '+91', disabled: true }, Validators.required],
    });
  }

  // ── Load ───
  loadUserProfile(): void {
    this.isLoading    = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.subs.add(
      this.userService.getProfile().subscribe(result => {
        if (result.ok) {
          // result.data is typed ProfileModel — use clean field names only
          const p: ProfileModel = result.data;
          this.profileForm.patchValue({
            firstName:   p.firstName,
            lastName:    p.lastName,
            dob:         p.dob,
            phone:       p.phone,
            countryCode: '+91',
          });
        } else {
          // result.error.message already human-readable from mapHttpError()
          this.errorMessage = result.error.message;
          this.message.error(result.error.message);
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      })
    );
  }

  // ── Basic Info ──
  enableBasicEdit(): void {
    this.isEditingBasic = true;
    ['firstName', 'lastName', 'dob'].forEach(f => this.profileForm.get(f)?.enable());
    this.cdr.markForCheck();
  }

  cancelBasicEdit(): void {
    this.isEditingBasic = false;
    ['firstName', 'lastName', 'dob'].forEach(f => this.profileForm.get(f)?.disable());
    this.loadUserProfile();
  }

  saveBasicInfo(): void {
    const fields = ['firstName', 'lastName', 'dob'];
    if (fields.some(f => this.profileForm.get(f)?.invalid)) {
      fields.forEach(f => this.profileForm.get(f)?.markAsTouched());
      this.cdr.markForCheck();
      return;
    }

    this.isSavingBasic = true;
    this.cdr.markForCheck();

    // Pass UI model shape — mapper in service converts to BE field names
    const payload: Pick<ProfileModel, 'firstName' | 'lastName' | 'dob'> = {
      firstName: this.profileForm.get('firstName')?.value,
      lastName:  this.profileForm.get('lastName')?.value,
      dob:       this.profileForm.get('dob')?.value,
    };

    this.subs.add(
      this.userService.updateProfileBasic(payload).subscribe(result => {
        if (result.ok) {
          this.isEditingBasic = false;
          ['firstName', 'lastName', 'dob'].forEach(f => this.profileForm.get(f)?.disable());
          this.message.success('Profile updated successfully');
        } else {
          this.message.error(result.error.message);
        }
        this.isSavingBasic = false;
        this.cdr.markForCheck();
      })
    );
  }

  // ── Phone ──
  // Phone edits currently disabled while API is unavailable for phone update.
  enablePhoneEdit(): void {
    this.message.warning('Phone number editing is temporarily disabled');
  }

  cancelPhoneEdit(): void {
    this.isEditingPhone = false;
    this.loadUserProfile();
  }

  savePhoneInfo(): void {
    this.message.warning('Phone number update is currently unsupported.');
  }

  get f() { return this.profileForm.controls; }
}
