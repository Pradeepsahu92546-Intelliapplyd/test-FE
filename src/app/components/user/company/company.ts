import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule }     from 'ng-zorro-antd/button';
import { NzInputModule }      from 'ng-zorro-antd/input';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzEmptyModule }      from 'ng-zorro-antd/empty';
import { NzMessageService }   from 'ng-zorro-antd/message';
import { NzSkeletonModule }   from 'ng-zorro-antd/skeleton';
import { Subscription }       from 'rxjs';

import { icons }        from '../../../shared/icons-provider';
import { UserService }  from '../../../services/user-service';
import { CompanyModel } from '../../../dto/models/user-profile.model';

@Component({
  selector: 'app-company',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    NzButtonModule, NzInputModule,
    NzIconModule, NzEmptyModule, NzSkeletonModule,
  ],
  templateUrl: './company.html',
  styleUrls:   ['./company.css'],
})
export class Company implements OnInit, OnDestroy {
  companyForm!: FormGroup;

  showForm      = false;
  noCompanyData = false;
  isEditMode    = false;
  isLoading     = true;
  isSaving      = false;
  errorMessage  = '';

  private subs = new Subscription();

  constructor(
    private fb:          FormBuilder,
    private iconService: NzIconService,
    private userService: UserService,
    private message:     NzMessageService,
    private cdr:         ChangeDetectorRef,
  ) {
    this.initForm();
    this.iconService.addIcon(...icons);
  }

  ngOnInit(): void    { this.loadCompanyDetails(); }
  ngOnDestroy(): void { this.subs.unsubscribe(); }

  // ── Load ───
  loadCompanyDetails(): void {
    this.isLoading    = true;
    this.errorMessage = '';
    this.noCompanyData = false;
    this.cdr.markForCheck();

    this.subs.add(
      this.userService.getCompanyDetails().subscribe(result => {
        if (result.ok) {
          // result.data is typed CompanyModel — clean field names match form exactly
          const companyData = result.data;
          this.companyForm.patchValue(companyData);
          console.log('Loaded company details:', companyData);

          const allFieldsEmpty = this.isCompanyDataEmpty(companyData);
          if (allFieldsEmpty) {
            this.noCompanyData = true;
            this.showForm = false;
            this.isEditMode = false;
            this.companyForm.disable();
          } else {
            this.noCompanyData = false;
            this.showForm = true;
            this.isEditMode = false;
            this.companyForm.disable();
          }
        } else {
          this.errorMessage = result.error.message;
          this.message.error(result.error.message);
          // No company data available → show Add button
          this.showForm = false;
          this.noCompanyData = true;
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      })
    );
  }

  private isCompanyDataEmpty(company: CompanyModel): boolean {
    return [company.name, company.phoneNumber, company.companyType, company.website, company.gstNumber]
      .every(v => !v || !v.toString().trim());
  }

  // ── Form ──
  initForm(): void {
    this.companyForm = this.fb.group({
      name:        ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      companyType: ['', Validators.required],
      website:     ['', [Validators.required, Validators.pattern(/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-]*)*$/)]],
      gstNumber:   ['', [Validators.required, Validators.pattern(/^[0-9A-Z]{10}$/)]],
    });
  }

  get f() { return this.companyForm.controls; }

  addCompany(): void {
    this.showForm   = true;
    this.isEditMode = true;
    this.companyForm.reset();
    this.companyForm.enable();
    this.cdr.markForCheck();
  }

  editCompany(): void {
    this.isEditMode = true;
    this.companyForm.enable();
    this.cdr.markForCheck();
  }

  cancelForm(): void {
    if (this.showForm && !this.isEditMode) return;   // already in view mode
    // If company was previously loaded → return to view mode
    // If brand new (never saved) → hide form
    const hasData = Object.values(this.companyForm.value).some(v => !!v);
    if (hasData) {
      this.isEditMode = false;
      this.companyForm.disable();
    } else {
      this.showForm = false;
    }
    this.cdr.markForCheck();
  }

  // ── Save ──
  saveCompany(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      this.cdr.markForCheck();
      return;
    }

    this.isSaving = true;
    this.cdr.markForCheck();

    // companyForm controls already match CompanyModel field names exactly
    const payload: CompanyModel = this.companyForm.getRawValue();

    this.subs.add(
      this.userService.updateCompanyDetails(payload).subscribe(result => {
        if (result.ok) {
          // result.data is typed CompanyModel — patch back in case BE normalised anything
          this.companyForm.patchValue(result.data);
          this.companyForm.disable();
          this.isEditMode = false;
          this.message.success('Company details updated successfully');
        } else {
          this.message.error(result.error.message);
        }
        this.isSaving = false;
        this.cdr.markForCheck();
      })
    );
  }
}
