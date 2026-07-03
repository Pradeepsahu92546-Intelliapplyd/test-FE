import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';
import { icons } from '../../../shared/icons-provider';
import { UserService } from '../../../services/user-service';

interface DeviceInf {
  name: string;
  time: string;
  icon: string;
}

@Component({
  selector: 'app-login-devices',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,  // ← fix #1
  imports: [CommonModule, NzIconModule, NzButtonModule, NzSkeletonModule],
  templateUrl: './login-devices.html',
  styleUrls: ['./login-devices.css'],
})
export class LoginDevices implements OnInit, OnDestroy {
  devices: DeviceInf[] = [];
  isLoading  = false;
  logoutAllLoading = false;
  // 

  private devicesSub?: Subscription;
  private logoutSub?: Subscription;

  constructor(
    private iconService: NzIconService,
    private userService: UserService,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef,   // ← fix #2
  ) {
    this.iconService.addIcon(...icons);
  }

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices(): void {
    this.isLoading = true;
    this.cdr.markForCheck();   // show skeleton immediately

    this.devicesSub = this.userService.getAllLoginDevices().subscribe({
      next: (response) => {
        if (response.code === 200 && response.data?.devices) {
          this.devices = response.data.devices.map((device: any) => ({
            name: device.deviceName,
            time: `${device.location}, ${new Date(device.lastActive).toLocaleString()}`,
            icon: this.resolveIcon(device.deviceName),
          }));
        }
        this.isLoading = false;
        this.cdr.markForCheck();   // ← fix #3: re-render after async
      },
      error: (error) => {
        console.error('Error loading devices:', error);
        this.message.error('Failed to load devices');
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  logoutDevice(device: DeviceInf): void {
    this.devices = this.devices.filter(d => d !== device);
    this.cdr.markForCheck();   // list updates immediately
    console.log('Logged out device:', device.name);
  }

  logoutAll(): void {
    this.logoutAllLoading = true;
    this.cdr.markForCheck();

    this.logoutSub = this.userService.logoutAllDevices().subscribe({
      next: (response) => {
        if (response.code === 200) {
          // Keep only the current device (Chrome on Windows)
          this.devices = this.devices.filter(d =>
            d.name.toLowerCase().includes('chrome on windows'),
          );
          this.message.success('Logged out from all other devices');
        }
        this.logoutAllLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error logging out devices:', error);
        this.message.error('Failed to logout devices');
        this.logoutAllLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  private resolveIcon(deviceName: string): string {
    const lower = deviceName?.toLowerCase() ?? '';
    return lower.includes('iphone') || lower.includes('samsung') || lower.includes('android')
      ? 'mobile'
      : 'laptop';
  }

  ngOnDestroy(): void {
    this.devicesSub?.unsubscribe();
    this.logoutSub?.unsubscribe();
  }
}