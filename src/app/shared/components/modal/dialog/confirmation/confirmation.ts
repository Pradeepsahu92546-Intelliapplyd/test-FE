import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [NzModalModule, NzButtonModule],
  templateUrl: './confirmation.html',
  styleUrls: ['./confirmation.css']
})
export class Confirmation {
  confirmModal?: NzModalRef;

  // 🔹 Inputs from parent
  @Input() title: string = 'Are you sure?';
  @Input() content: string = 'Please confirm your action.';
  @Input() okColor: boolean = false;   // default blue
  @Input() okText: string = 'Yes';
  @Input() cancelText: string = 'No';

  // 🔹 Emit to parent when confirmed
  @Output() confirmed = new EventEmitter<void>();

  constructor(private modal: NzModalService) { }

  showConfirm(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: this.title,
      nzContent: this.content,
      nzOkText: this.okText,
      nzCancelText: this.cancelText,
      nzOkType: 'primary', 
      nzOkDanger: this.okColor, 
      nzOnOk: () => {
        this.confirmed.emit();  // send event to parent
      }
    });
    console.log("ok color is :",this.okColor)
  }
}
