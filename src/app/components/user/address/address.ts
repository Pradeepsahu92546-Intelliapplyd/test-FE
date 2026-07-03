import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import { CommonModule }       from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzButtonModule }     from 'ng-zorro-antd/button';
import { NzInputModule }      from 'ng-zorro-antd/input';
import { NzSelectModule }     from 'ng-zorro-antd/select';
import { NzCheckboxModule }   from 'ng-zorro-antd/checkbox';
import { NzTagModule }        from 'ng-zorro-antd/tag';
import { NzEmptyModule }      from 'ng-zorro-antd/empty';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzMessageService }   from 'ng-zorro-antd/message';
import { NzSkeletonModule }   from 'ng-zorro-antd/skeleton';
import { Subscription }       from 'rxjs';

import { icons }              from '../../../shared/icons-provider';
import { UserService }        from '../../../services/user-service';
import { AddressModel } from '../../../dto/models/user-profile.model';
import { AddressMapper } from '../../../dto/mappers/user-profile.mapper';  
@Component({
  selector: 'app-address',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    NzButtonModule, NzInputModule, NzSelectModule,
    NzCheckboxModule, NzTagModule, NzEmptyModule,
    NzIconModule, NzSkeletonModule,
  ],
  templateUrl: './address.html',
  styleUrl:    './address.css',
})
export class Address implements OnInit, OnDestroy {
  addresses:    AddressModel[] = [];
  showForm      = false;
  editingIndex: number | null  = null;
  isLoading     = false;
  isSaving      = false;
  errorMessage  = '';
  addressForm!: FormGroup;

  private subs = new Subscription();

  constructor(
    private iconService:    NzIconService,
    private fb:             FormBuilder,
    private userService:    UserService,
    private message:        NzMessageService,
    private cdr:            ChangeDetectorRef,
  ) {
    this.iconService.addIcon(...icons);
    this.initForm();
  }

  ngOnInit(): void    { this.loadAddresses(); }
  ngOnDestroy(): void { this.subs.unsubscribe(); }

  // ── Load ──────────────────────────────────────────────────────────────────
  loadAddresses(): void {
    this.isLoading    = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.subs.add(
      this.userService.getAddress().subscribe(result => {
        if (result.ok) {
          // result.data is Pick<AddressModel, 'id' | 'fullAddress'>[]
          // Scaffold with partial data, then hydrate each via getAddressById
          this.addresses = result.data.map(item => ({
            id:             item.id,
            fullAddress:    item.fullAddress,
            streetAddress1: '',
            streetAddress2: '',
            city:           '',
            state:          '',
            country:        '',
            postalCode:     '',
            addressType:    '',
            locationLink:   null,
          }));
          this.cdr.markForCheck();
          console.log('Loaded addresses with partial data:', this.addresses);

          // Hydrate each with full detail
          result.data.forEach((item, index) => {
            this.subs.add(
              this.userService.getAddressById(item.id, item.fullAddress).subscribe(detailResult => {
                if (detailResult.ok) {
                  // detailResult.data is full AddressModel — all clean field names
                  this.addresses[index] = detailResult.data;
                  this.cdr.markForCheck();
                }
                // silent fail per-address — list still shows partial data
              })
            );
          });
        } else {
          this.errorMessage = result.error.message;
          this.message.error(result.error.message);
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      })
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  initForm(): void {
    this.addressForm = this.fb.group({
      postalCode:     ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]],
      city:           ['', Validators.required],
      state:          ['', Validators.required],
      streetAddress1: ['', Validators.required],
      streetAddress2: [''],
      country:        ['India', Validators.required],
      addressType:    ['Office'],
    });
  }

  addAddress(): void {
    this.showForm     = true;
    this.editingIndex = null;
    this.addressForm.reset({ country: 'India', addressType: 'Office' });
    this.enableFormFields();
    this.cdr.markForCheck();
  }

  editAddress(index: number): void {
    this.showForm     = true;
    this.editingIndex = index;
    const a = this.addresses[index];
    this.addressForm.patchValue({
      postalCode:     a.postalCode,
      streetAddress1: a.streetAddress1,
      streetAddress2: a.streetAddress2,
      city:           a.city,
      state:          a.state,
      country:        a.country,
      addressType:    a.addressType,
    });
    this.enableFormFields();
    this.cdr.markForCheck();
  }

  private enableFormFields(): void {
    ['postalCode', 'city', 'state', 'streetAddress1', 'streetAddress2'].forEach(f =>
      this.addressForm.get(f)?.enable()
    );
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  deleteAddress(index: number): void {
    const id = this.addresses[index].id;
    this.subs.add(
      this.userService.deleteAddress(id).subscribe(result => {
        if (result.ok) {
          this.addresses = this.addresses.filter((_, i) => i !== index);
          this.message.success('Address deleted successfully');
        } else {
          this.message.error(result.error.message);
        }
        this.cdr.markForCheck();
      })
    );
  }

  cancelForm(): void {
    this.showForm     = false;
    this.editingIndex = null;
    this.addressForm.disable();
    this.cdr.markForCheck();
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  saveAddress(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      this.cdr.markForCheck();
      return;
    }

    // getRawValue() captures all form field values
    const raw = this.addressForm.getRawValue();

    // Build an AddressModel to pass to service — mapper handles BE field conversion
    const formModel: Omit<AddressModel, 'id' | 'fullAddress' | 'locationLink'> = {
      streetAddress1: raw.streetAddress1,
      streetAddress2: raw.streetAddress2 ?? '',
      city:           raw.city,
      state:          raw.state,
      country:        raw.country,
      postalCode:     raw.postalCode,
      addressType:    raw.addressType,
    };

    this.isSaving = true;
    this.cdr.markForCheck();

    if (this.editingIndex !== null) {
      // Build full AddressModel (service updateAddress needs id + fullAddress too)
      const existing = this.addresses[this.editingIndex!];
      const updated: AddressModel = {
        ...formModel,
        id:           existing.id,
        fullAddress:  AddressMapper.buildFullAddress(formModel),
        locationLink: existing.locationLink,
      };

      this.subs.add(
        this.userService.updateAddress(updated).subscribe(result => {
          if (result.ok) {
            // result.data is full AddressModel — no manual field mapping needed
            this.addresses[this.editingIndex!] = result.data;
            this.showForm     = false;
            this.editingIndex = null;
            this.addressForm.disable();
            this.message.success('Address updated successfully');
          } else {
            this.message.error(result.error.message);
          }
          this.isSaving = false;
          this.cdr.markForCheck();
        })
      );
    } else {
      this.subs.add(
        this.userService.addAddress(formModel).subscribe(result => {
          if (result.ok) {
            // Add the returned address to local list
            this.addresses = [...this.addresses, result.data];
            this.showForm     = false;
            this.editingIndex = null;
            this.addressForm.disable();
            this.message.success('Address added successfully');
          } else {
            this.message.error(result.error.message);
          }
          this.isSaving = false;
          this.cdr.markForCheck();
        })
      );
    }
  }
}
