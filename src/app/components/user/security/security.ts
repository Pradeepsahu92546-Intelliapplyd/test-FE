import { Component } from '@angular/core';

import { ChangePassword } from '../change-password/change-password';
import { LoginDevices } from '../login-devices/login-devices';
@Component({
  selector: 'app-security',
  standalone: true,
  imports: [
    LoginDevices,
    ChangePassword
  ],
  templateUrl: './security.html',
  styleUrl: './security.css'
})
export class Security {
}
