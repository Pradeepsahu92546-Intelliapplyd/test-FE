import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-upi-dialog',
  imports: [
    NzButtonModule,
    NzModalModule,
    FormsModule,
    NzInputModule,
    CommonModule
  ],
  templateUrl: './upi-dialog.html',
  styleUrl: './upi-dialog.css'
})
export class UpiDialog {
   isVisible = false;
  otp: string = '';
  


  @Input() title: string = 'Are you sure?';
  @Input() content: string = 'Please confirm your action.';
  @Input() okText: string = 'Yes';
  @Input() cancelText: string = 'No';
  @Output() confirmed = new EventEmitter<string | undefined>();

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('full otp!', this.otp);
      this.confirmed.emit(this.otp);
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }



}
