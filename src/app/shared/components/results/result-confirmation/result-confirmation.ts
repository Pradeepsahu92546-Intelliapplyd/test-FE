import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzResultStatusType } from 'ng-zorro-antd/result';


@Component({
  selector: 'app-result-confirmation',
  imports: [CommonModule, NzButtonModule, NzResultModule],
  templateUrl: './result-confirmation.html',
  styleUrl: './result-confirmation.css',
})
export class ResultConfirmation{
  // Inputs for dynamic content
  @Input() status: NzResultStatusType = 'warning'; // 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500'
  @Input() title: string = '';
  @Input() requestId: string = '';
  @Input() time: string = '';
  @Input() message: string = 'Cloud server configuration takes 1-5 minutes, please wait.';
  
  // Button Config
  @Input() primaryBtnText: string = 'Go to Login';
  @Input() showSecondaryBtn: boolean = false;
  @Input() secondaryBtnText: string = 'Back';


  // Events
  @Output() primaryClick = new EventEmitter<void>();
  @Output() secondaryClick = new EventEmitter<void>();


  onPrimaryClick(): void {
    this.primaryClick.emit();
  }


  onSecondaryClick(): void {
    this.secondaryClick.emit();
  }
}
