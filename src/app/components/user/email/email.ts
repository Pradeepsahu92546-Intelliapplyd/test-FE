import { Component, ViewChild, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { icons } from '../../../shared/icons-provider';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { InputDialog } from '../../../shared/components/modal/dialog/Input-dialog-new/input-dialog';
import { UserService } from '../../../services/user-service';

interface EmailInf {
  address: string;
  isDefault: boolean;
  createdAt: string;
  verified: boolean; 
}


@Component({
  selector: 'app-email',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzTagModule,
    InputDialog
  ],
  templateUrl: './email.html',
  styleUrl: './email.css'
})
export class Email implements OnInit {

  @ViewChild(InputDialog) eamilDialog!: InputDialog;

  emails: EmailInf[] = [];
  loading = false;

  newEmail: string | undefined = '';
  isDefault: boolean = false;
  readonly isPrimary: boolean = false; // cannot be changed by user

  constructor(
    private msg: NzMessageService,
    private iconService: NzIconService,
    private userService: UserService
  ) {
    this.iconService.addIcon(...icons);
  }

  ngOnInit() {
    this.loadEmails();
  }

  loadEmails() {
    this.loading = true;
    this.userService.getAdditionalEmails().subscribe({
      next: (response) => {
        if (response.code === 200 && response.data.emails) {
          this.emails = response.data.emails.map((email: any) => ({
            address: email.email,
            isDefault: email.isDefault,
            createdAt: 'Recently added', // Mock, since API doesn't have createdAt
            verified: true // Assume verified if in list
          }));
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading emails:', error);
        this.msg.error(error.error.message || 'Please try again later');
        this.loading = false;
      }
    });
  }

  // data object contains { email?: string, isDefault: boolean }
  handelOnEmail(data: any) {
    this.newEmail = data?.email;
    this.isDefault = data?.isDefault || false;
    console.log('Email received from child:', this.newEmail, 'default?', this.isDefault);
    if (!this.newEmail) {
      this.msg.error('Please enter a valid email address');
      return;
    }
    this.loading = true;
    // always send isPrimary=false since user cannot modify it
    this.userService.addAdditionalEmail(this.newEmail, this.isPrimary, this.isDefault).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.msg.success('Email added successfully');
          this.loadEmails();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error adding email:', error);
        this.msg.error(error.error.message || 'Please try again later');
        this.loading = false;
      }
    });
  }

  // Delete email
  deleteEmail(index: number) {
    this.emails.splice(index, 1);
    this.msg.success('Email deleted');
  }
}
