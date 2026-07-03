import { Component, signal } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { Login } from '../login/login';
import { Register } from '../register/register';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-auth-shell',
  imports: [NzTabsModule, Login, Register, NzDividerModule],
  templateUrl: './auth-shell.html',
  styleUrl: './auth-shell.css'
})
export class AuthShell {
  tabIndex = signal(0);
}



