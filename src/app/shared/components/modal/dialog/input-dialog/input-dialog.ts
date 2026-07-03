import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconService } from 'ng-zorro-antd/icon';
import { icons } from '../../../../icons-provider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-dialog',
  imports: [
    NzButtonModule,
    NzModalModule,
    FormsModule,
    NzInputModule,
    NzIconModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './input-dialog.html',
  styleUrl: './input-dialog.css',
})
export class InputDialog {
  constructor(private iconService: NzIconService) {
    this.iconService.addIcon(...icons);
  }
  @Input() title: string = 'Are you sure?';
  @Input() content: string = 'Please confirm your action.';
  @Input() okText: string = 'Yes';
  @Input() cancelText: string = 'No';
  @Output() confirmed = new EventEmitter<string | undefined>();

  submitted = false;

  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.submitted = true;
    if (this.emailForm.valid) {
      console.log('Button ok clicked!');
      this.isVisible = false;
      this.confirmed.emit(this.emailForm.get('email')?.value ?? undefined);
    }
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  getEmailErrorTip(): string {
    const emailControl = this.emailForm.get('email');
    if (this.submitted && emailControl?.hasError('required')) {
      return 'Please enter an email address';
    } else if (this.submitted && emailControl?.hasError('email')) {
      return 'Invalid email format';
    }
    return '';
  }
}
