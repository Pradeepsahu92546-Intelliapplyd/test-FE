import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-verification',
  imports: [
    NzButtonModule,
    NzModalModule,
    FormsModule,
    NzInputModule,
    CommonModule
  ],
  templateUrl: './verification.html',
  styleUrl: './verification.css'
})
export class Verification {
  isVisible = false;
  otp: string = '';
  
  time = 5

  @Input() title: string = 'Are you sure?';
  @Input() content: string = 'Please confirm your action.';
  @Input() okText: string = 'Yes';
  @Input() cancelText: string = 'No';
  @Output() confirmed = new EventEmitter<string | undefined>();

  showModal(): void {
    this.isVisible = true;
    this.startTimer()
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

  resendCode() {
  }
  startTimer() {

   
  }

}
