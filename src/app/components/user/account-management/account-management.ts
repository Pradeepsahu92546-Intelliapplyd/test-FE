import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Confirmation } from '../../../shared/components/modal/dialog/confirmation/confirmation';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from '../../../services/user-service';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-account-management',
  imports: [Confirmation,
    FormsModule,
    NzCardModule,
    NzSelectModule,
    NzSwitchModule,
    NzButtonModule,],
  templateUrl: './account-management.html',
  styleUrl: './account-management.css'
})
export class AccountManagement {
  @ViewChild('deleteConfirm') deleteConfirm!: Confirmation;
  @ViewChild('deactivateConfirm') deactivateConfirm!: Confirmation;
  loading = false;

  constructor(
    private notification: NzNotificationService,
    private userService: UserService,
    private message: NzMessageService
  ) {}

  deleteAccount(){
    this.loading = true;
    this.userService.deleteAccount().subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.message.success('Account deleted successfully');
        }
        this.loading = false;
      },
      error: (error) => {

        this.message.error(error.error.message || 'Failed to delete account');
        this.loading = false;
      }
    });
  }

  deactivateAccount(){
    this.loading = true;
    this.userService.deactivateAccount().subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.message.success('Account deactivated successfully');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error deactivating account:', error);
        this.message.error( error.error.message || 'Failed to deactivate account');
        this.loading = false;
      }
    });
  }
  triggerDelete(){
        this.deleteConfirm.showConfirm();
  }
  triggerDeactivate(){
        this.deactivateConfirm.showConfirm();
  }
  
}
