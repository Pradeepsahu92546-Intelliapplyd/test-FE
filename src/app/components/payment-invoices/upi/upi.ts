import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCardModule } from 'ng-zorro-antd/card';
import { UpiDialog } from '../../../shared/components/modal/dialog/upi-dialog/upi-dialog';
@Component({
  selector: 'app-upi',
  standalone: true,
  imports: [CommonModule, FormsModule, NzButtonModule, NzRadioModule, NzCardModule, UpiDialog],
  templateUrl: './upi.html',
  styleUrl: './upi.css'
})
export class Upi {
  upiList: string[] = [];
  selectedUpi: string | null = null;
  @ViewChild(UpiDialog) upiDialog!: UpiDialog;

  addUpi() {
    this.upiDialog.showModal() 
  }

  handelOnOUpi(data: string | undefined) {
    if(data){
      this.upiList.push(data);
    }
  }
}
