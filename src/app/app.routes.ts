import { Routes } from '@angular/router';
import { AuthShell } from './components/auth/auth-shell/auth-shell';
import { AuthDashboard } from './components/user-tem/dashboard/auth-dashboard';
import { authGuard } from './components/auth/auth.guard';
import { Sidenav } from './shared/components/profile-sidenav/sidenav';
import { SubscriptionsPricing } from './components/subscriptions/subscriptions-pricing/subscriptions-pricing';
import { EmailPending } from './shared/components/results/email-pending/email-pending';
import { SelectAddon } from './components/subscriptions/select-addon/select-addon';
import { Profile } from './components/user/profile/profile';
import { Security } from './components/user/security/security';
import { Account } from './components/user/account/account';
import { DashboardHome } from './components/dashboard/dashboard-home/dashboard-home';
import { AccountSettingLanding } from './components/user/account-setting-landing/account-setting-landing';
import { Preferences } from './components/user/preferences/preferences';
import { UnitManage } from './components/units/unit-manage/unit-manage';
import { UnitManagerSidenav } from './shared/components/unit-manager-sidenav/unit-manager-sidenav';
import { UnitsList } from './components/units/units-list/units-list';
import { BillingLanding } from './components/payment-invoices/billing-landing/billing-landing';
import { SubscriptionList } from './components/subscriptions/subscription-list/subscription-list';
import { ActivateAccount } from './components/auth/activate-account/activate-account';
import { RoleManagement } from './components/units/role-management/role-management';

export const routes: Routes = [
  // Auth routes
  { path: 'auth', component: AuthShell },
  { path: 'auth/verify-email', component: EmailPending },
  { path: 'auth/activate-account', component: ActivateAccount },

  // ── App routes ───
  {
    path: 'auth/select-addons',
    component: SelectAddon,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard-home',
    component: DashboardHome,
    canActivate: [authGuard],
  },
  { path: 'account-settings-landing', component: AccountSettingLanding },
  { path: 'unit-manage', component: UnitManage },
  { path: 'subscriptions-pricing', component: SubscriptionsPricing },

  // ──  Sidenav as layout shell with children ──
  {
    path: 'user',
    component: Sidenav,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'subscriptions', component: SubscriptionsPricing },
      { path: 'profile', component: Profile },
      { path: 'security', component: Security },
      { path: 'account', component: Account },
      { path: 'preference', component: Preferences },
    ],
  },

  // ── Unit manager sidenav as layout shell with children ──

  {
    path: 'manage',
    component: UnitManagerSidenav,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'units', pathMatch: 'full' },
      { path: 'units', component: UnitsList },
      { path: 'units/:unitSlug', component: UnitsList },
      { path: 'billings', component: BillingLanding },
      { path: 'subscription-lists', component: SubscriptionList },
      { path: 'permissions/roles', component: RoleManagement },

      // { path: 'teams', component: TeamsComponent },
      // { path: 'permissions/rules', component: PermRulesComponent },
      // { path: 'permissions/roles', component: PermRolesComponent },
      // { path: 'permissions/resources', component: PermResourcesComponent },
      // { path: 'requests', component: RequestsComponent },
    ],
  },

  // ── Default & fallback ───
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' },
];
