import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '../../../services/user-service';
import { NzDividerModule } from 'ng-zorro-antd/divider';

interface PreferenceSnapshot {
  theme: string;
  language: string;
  currency: string;
  timezone: string;
  sessionTimeout: number;
  reports: boolean;
  promotion: boolean;
  securityAlerts: boolean;
  mfaEnforced: boolean;
}

@Component({
  selector: 'app-preferences',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,   // ← fix issue-3
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzSelectModule,
    NzSwitchModule,
    NzButtonModule,
    NzSkeletonModule,
    NzDividerModule
  ],
  templateUrl: './preferences.html',
  styleUrl: './preferences.css',
})
export class Preferences implements OnInit {

  // ── Form fields ──────────────────────────────────
  theme          = 'light';
  language       = 'en-IN';
  currency       = 'INR';
  timezone       = 'Asia/Kolkata';
  sessionTimeout = 60;
  reports        = false;
  promotion      = false;
  securityAlerts = true;
  mfaEnforced    = true;

  // ── UI state ─────────────────────────────────────
  isLoading = true;    // initial data load skeleton   ← fix issue-3
  isSaving  = false;   // save button spinner          ← fix issue-2

  /** Snapshot of values as loaded from API — used for dirty check */
  private savedSnapshot: PreferenceSnapshot | null = null;  // ← fix issue-2

  constructor(
    private userService: UserService,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef,   // ← fix issue-3
  ) {}

  ngOnInit(): void {
    this.loadPreferences();
  }

  // ── issue-2: computed dirty flag ─────────────────
  get hasEdits(): boolean {
    if (!this.savedSnapshot) return false;
    const s = this.savedSnapshot;
    return (
      this.theme          !== s.theme          ||
      this.language       !== s.language       ||
      this.currency       !== s.currency       ||
      this.timezone       !== s.timezone       ||
      this.sessionTimeout !== s.sessionTimeout ||
      this.reports        !== s.reports        ||
      this.promotion      !== s.promotion      ||
      this.securityAlerts !== s.securityAlerts ||
      this.mfaEnforced    !== s.mfaEnforced
    );
  }

  loadPreferences(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.userService.getUserPreference().subscribe({
      next: (response) => {
        if (response.code === 200 && response.data?.preferences) {
          const { userSettings, accountSettings } = response.data.preferences;

          this.theme          = userSettings.localization.theme          ?? 'light';
          this.language       = userSettings.localization.language       ?? 'en-IN';
          this.currency       = userSettings.localization.currency       ?? 'INR';
          this.timezone       = userSettings.localization.timezone       ?? 'Asia/Kolkata';
          this.reports        = userSettings.notifications.emailPreference.reports        ?? false;
          this.promotion      = userSettings.notifications.emailPreference.promotion      ?? false;
          this.securityAlerts = userSettings.notifications.emailPreference.securityAlerts ?? true;
          this.mfaEnforced    = accountSettings.governance.mfaEnforced            ?? true;
          this.sessionTimeout = accountSettings.governance.sessionTimeoutMinutes   ?? 60;
        }

        // Save a snapshot so hasEdits can diff against it
        this.savedSnapshot = this.currentSnapshot();
        this.isLoading = false;
        this.cdr.markForCheck();   // ← fix issue-3
      },
      error: (error) => {
        console.error('Error loading preferences:', error);
        this.message.error('Failed to load preferences');
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  savePreferences(): void {
    if (!this.hasEdits) return;

    this.isSaving = true;
    this.cdr.markForCheck();

    const data = {
      userSettings: {
        localization: {
          theme:    this.theme,
          currency: this.currency,
          language: this.language,
          timezone: this.timezone,
        },
        notifications: {
          pushEnabled: true,
          emailPreference: {
            reports:        this.reports,
            promotion:      this.promotion,
            securityAlerts: this.securityAlerts,
          },
        },
      },
      accountSettings: {
        governance: {
          mfaEnforced:            this.mfaEnforced,
          sessionTimeoutMinutes:  this.sessionTimeout,
        },
        unitBoundaries: {
          crossUnitCollaboration: 'view_only',
        },
      },
    };

    this.userService.updateUserPreference(data).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.message.success('Preferences updated successfully');
          // Update snapshot so hasEdits resets to false
          this.savedSnapshot = this.currentSnapshot();
        }
        this.isSaving = false;
        this.cdr.markForCheck();   // ← fix issue-3
      },
      error: (error) => {
        console.error('Error updating preferences:', error);
        this.message.error('Failed to update preferences');
        this.isSaving = false;
        this.cdr.markForCheck();
      },
    });
  }

  /** Helper: capture current form state as a snapshot */
  private currentSnapshot(): PreferenceSnapshot {
    return {
      theme:          this.theme,
      language:       this.language,
      currency:       this.currency,
      timezone:       this.timezone,
      sessionTimeout: this.sessionTimeout,
      reports:        this.reports,
      promotion:      this.promotion,
      securityAlerts: this.securityAlerts,
      mfaEnforced:    this.mfaEnforced,
    };
  }
}