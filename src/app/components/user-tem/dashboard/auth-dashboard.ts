import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth/auth';

@Component({
  selector: 'app-auth-dashboard',
  imports: [NzButtonModule],
  templateUrl: './auth-dashboard.html',
  styleUrl: './auth-dashboard.css',
})
export class AuthDashboard {
  constructor(private auth: Auth, private router: Router) {}
  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/auth');
  }
}
// This component serves as a simple dashboard for authenticated users, allowing them to log out.
