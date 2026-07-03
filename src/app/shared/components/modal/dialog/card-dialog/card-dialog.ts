import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'app-card-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzModalModule,
    NzInputModule,
    NzDatePickerModule,
    NzIconModule,
    NzSwitchModule
  ],
  templateUrl: './card-dialog.html',
  styleUrls: ['./card-dialog.css']
})
export class CardDialog {

  isVisible = false;

  // form fields
  cardholderName: string = '';
  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';
  switchValue:boolean = false;

  @Input() title: string = 'Add card';
  @Input() okText: string = 'Yes';
  @Input() cancelText: string = 'No';
  @Output() confirmed = new EventEmitter<any>();

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    if (!this.cardholderName || !this.cardNumber || !this.expiryDate || !this.cvv) {
      return; // don’t submit if empty
    }
    const cardData = {
      name: this.cardholderName,
      card_number: this.cardNumber,
      expiry: this.expiryDate,
      cvv: this.cvv,
      isDefault:this.switchValue
    };
    this.confirmed.emit(cardData);
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
