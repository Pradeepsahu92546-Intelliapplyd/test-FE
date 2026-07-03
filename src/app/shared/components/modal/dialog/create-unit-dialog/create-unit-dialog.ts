import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-unit-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzInputModule,
    NzButtonModule,
  ],
  templateUrl: './create-unit-dialog.html',
  styleUrl: './create-unit-dialog.css',
})
export class CreateUnitDialog {
  isVisible = false;
  submitted = false;

  @Output() confirmed = new EventEmitter<any>();

  unitForm = new FormGroup({
    unitName: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.maxLength(100)]), // Max 20 words logic usually handled by validator or helper
  });

  showModal(): void {
    this.isVisible = true;
    this.submitted = false;
    this.unitForm.reset();
  }

  handleOk(): void {
    this.submitted = true;
    if (this.unitForm.valid) {
      this.confirmed.emit(this.unitForm.value);
      this.isVisible = false;
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
