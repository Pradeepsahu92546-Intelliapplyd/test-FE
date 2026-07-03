import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch'; // Import Switch
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-unit-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzInputModule,
    NzButtonModule,
    NzSwitchModule,
  ],
  templateUrl: './edit-unit-dialog.html',
  styleUrl: './edit-unit-dialog.css',
})
export class EditUnitDialog {
  isVisible = false;

  @Output() updated = new EventEmitter<any>();

  editUnitForm = new FormGroup({
    unitName: new FormControl({ value: '', disabled: true }),
    description: new FormControl('Unit for plantA monitoring'),
    isDefault: new FormControl(false),
  });

  // When opening for Edit, you should pass the existing data
  showModal(data?: any): void {
    if (data) {
      this.editUnitForm.patchValue(data);
    }
    this.isVisible = true;
  }

  handleUpdate(): void {
    console.log('Form Data:', this.editUnitForm.value);
    this.updated.emit(this.editUnitForm.value);
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
