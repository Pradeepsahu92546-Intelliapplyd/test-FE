import {
  Component, OnInit, OnDestroy, NgZone,
  ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import { CommonModule }       from '@angular/common';
import { NzButtonModule }     from 'ng-zorro-antd/button';
import { NzCardModule }       from 'ng-zorro-antd/card';
import { NzAvatarModule }     from 'ng-zorro-antd/avatar';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzMessageService }   from 'ng-zorro-antd/message';
import { NzUploadModule }     from 'ng-zorro-antd/upload';
import { NzSkeletonModule }   from 'ng-zorro-antd/skeleton';
import { Subscription }       from 'rxjs';

import { icons }           from '../../../shared/icons-provider';
import { UserService }     from '../../../services/user-service';
import { ProfileModel } from '../../../dto/models/user-profile.model';

const DEFAULT_AVATAR =
  'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80';

@Component({
  selector: 'app-image-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NzButtonModule,
    NzCardModule,
    NzAvatarModule,
    NzIconModule,
    NzUploadModule,
    NzSkeletonModule,
  ],
  templateUrl: './image-card.html',
  styleUrls:   ['./image-card.css'],
})
export class ImageCard implements OnInit, OnDestroy {
  firstName:  string = '';
  lastName:   string = '';
  email:      string = '';
  profileImg: string = DEFAULT_AVATAR;
  defalutImg: string = DEFAULT_AVATAR;

  isLoading   = true;
  isUploading = false;

  /** Ensures we always have a valid image URL; falls back to the default on load errors. */
  onImgError(): void {
    if (this.profileImg !== DEFAULT_AVATAR) {
      this.profileImg = DEFAULT_AVATAR;
      this.cdr.markForCheck();
    }
  }

  selectedFile: File | null                   = null;
  previewUrl:   string | ArrayBuffer | null   = null;

  private subs = new Subscription();

  constructor(
    private userService:    UserService,
    private iconService:    NzIconService,
    private messageService: NzMessageService,
    private ngZone:         NgZone,
    private cdr:            ChangeDetectorRef,
  ) {
    this.iconService.addIcon(...icons);
  }

  ngOnInit(): void    { this.loadUserProfile(); }
  ngOnDestroy(): void { this.subs.unsubscribe(); }

  // ── Load ────
  loadUserProfile(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.subs.add(
      this.userService.getProfile().subscribe(result => {
        if (result.ok) {
          // result.data is typed ProfileModel — no raw BE fields
          const p: ProfileModel = result.data;
          this.firstName  = p.firstName;                  // ← was userData.fname
          this.lastName   = p.lastName;                   // ← was userData.lname
          this.email      = p.email;
          this.profileImg = p.profileImage || DEFAULT_AVATAR;  // ← was userData.pic
        } else {
          // result.error.message is safe and human-readable from mapHttpError()
          this.messageService.error(result.error.message);
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      })
    );
  }

  // ── File selection → preview → auto-upload ───
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0]) return;

    const file = input.files[0];
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.ngZone.run(() => {
        this.previewUrl = reader.result;
        this.profileImg = reader.result as string;
        this.cdr.markForCheck();   // preview update needs explicit trigger with OnPush
        this.onUpload();
      });
    };
    reader.readAsDataURL(file);
  }

  // ── Upload ────────────────────────────────────────────────────────────────
  onUpload(): void {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.cdr.markForCheck();

    const formData = new FormData();
    formData.append('profile_pic', this.selectedFile, this.selectedFile.name);

    this.subs.add(
      this.userService.uploadProfileImage(formData).subscribe(result => {
        if (result.ok) {
          this.messageService.success('Profile image updated successfully');
        } else {
          // Roll back preview on failure
          this.profileImg  = DEFAULT_AVATAR;
          this.previewUrl  = null;
          this.messageService.error(result.error.message);  // ← was generic 'Upload failed'
        }
        this.isUploading  = false;
        this.selectedFile = null;
        this.cdr.markForCheck();
      })
    );
  }
}