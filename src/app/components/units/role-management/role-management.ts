import {
  Component,
  OnInit,
  OnDestroy, ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { Subscription } from 'rxjs';

import { PermissionsService } from '../../../services/permissions-service';
import {
  RoleDetailsModel,
  RoleListModel,
} from '../../../dto/models/unit-permissions.model';
import { RolePanel } from '../../../shared/components/modal/role-panel/role-panel';
import { Confirmation } from '../../../shared/components/modal/dialog/confirmation/confirmation';

@Component({
  selector: 'app-role-management',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzDropDownModule,
    NzTagModule,
    NzIconModule,
    NzSkeletonModule,
    RolePanel,Confirmation
  ],
  templateUrl: './role-management.html',
  styleUrl: './role-management.css',
})
export class RoleManagement implements OnInit, OnDestroy {
  // Confirmation dialog ref
  @ViewChild('confirmDialog') confirmDialog!: Confirmation;
 
  // ── Data ──
  roles:           RoleDetailsModel[] = [];
  filteredRoles:   RoleDetailsModel[] = [];
  isLoading        = true;
  searchText       = '';
  filterType       = '';
 
  // Panel state
  panelVisible     = false;
  panelMode:       'details' | 'create' | 'edit' = 'details';
  selectedRole:    RoleDetailsModel | null = null;
 
  private subs = new Subscription();
 
  constructor(
    private permissionsService: PermissionsService,
    private message:            NzMessageService,
    private cdr:                ChangeDetectorRef,
    private notification:       NzNotificationService,
  ) {}
 
  ngOnInit(): void    { this.loadRoles(); }
  ngOnDestroy(): void { this.subs.unsubscribe(); }
 
  // ── Load ──
  loadRoles(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
 
    this.subs.add(
      this.permissionsService.getRolesList().subscribe(result => {
        if (result.ok) {
          this.roles = result.data.roles;
          this.applyFilter();
        } else {
          this.notification.error('Error', result.error.message);
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      })
    );
  }
 
  // ── Filter / Search ──────
  applyFilter(): void {
    let list = [...this.roles];
    if (this.searchText.trim()) {
      const q = this.searchText.toLowerCase();
      list = list.filter(r =>
        r.roleName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    }
    if (this.filterType) {
      list = list.filter(r =>
        this.filterType === 'predefined' ? !r.isCustom : r.isCustom
      );
    }
    this.filteredRoles = list;
    this.cdr.markForCheck();
  }
 
  onSearch(): void    { this.applyFilter(); }
  setFilter(type: string): void { this.filterType = type; this.applyFilter(); }
 
  // ── Role type display ────
  getRoleTypeLabel(role: RoleDetailsModel): string {
    if (!role.isCustom) return 'Predefined';
    const count = role.composition.length;
    return `Custom (${count})`;
  }
 
  // ── Panel open ────
  openDetails(role: RoleDetailsModel): void {
    this.selectedRole = role;
    this.panelMode    = 'details';
    this.panelVisible = true;
    this.cdr.markForCheck();
  }
 
  openCreate(): void {
    this.selectedRole = null;
    this.panelMode    = 'create';
    this.panelVisible = true;
    this.cdr.markForCheck();
  }
 
  openEdit(role: RoleDetailsModel): void {
    this.selectedRole = role;
    this.panelMode    = 'edit';
    this.panelVisible = true;
    this.cdr.markForCheck();
  }
 
  closePanel(): void {
    this.panelVisible = false;
    this.cdr.markForCheck();
  }
 
  // ── Panel events ──
  onRoleCreated(role: RoleDetailsModel): void {
    this.roles = [...this.roles, role];
    this.applyFilter();
    this.closePanel();
  }
 
  onRoleUpdated(role: RoleDetailsModel): void {
    this.roles = this.roles.map(r => r.roleId === role.roleId ? role : r);
    this.applyFilter();
    this.closePanel();
  }
 
  onRoleDeleted(roleId: string): void {
    this.roles = this.roles.filter(r => r.roleId !== roleId);
    this.applyFilter();
    this.closePanel();
  }
 
  onRoleCloned(role: RoleDetailsModel): void {
    this.roles = [...this.roles, role];
    this.applyFilter();
    this.closePanel();
  }
 
  // ── Quick clone from table row ────
  cloneRole(role: RoleDetailsModel, event: MouseEvent): void {
    event.stopPropagation();
    this.subs.add(
      this.permissionsService.cloneRole(role.roleId).subscribe(result => {
        if (result.ok) {
          this.roles = [...this.roles, result.data];
          this.applyFilter();
          this.notification.success("success",`Role cloned as "${result.data.roleName}"`);
        } else {
          this.notification.error("Error", result.error.message);
        }
        this.cdr.markForCheck();
      })
    );
  }
 
  // ── Quick delete from table row ────
  deleteRole(role: RoleDetailsModel, event: MouseEvent): void {
    this.confirmDialog.title = 'Delete Role';
    this.confirmDialog.content = `Are you sure you want to delete the role "${role.roleName}"? This action cannot be undone.`;
    this.confirmDialog.okColor = true;
    this.confirmDialog.showConfirm();
    this.confirmDialog.confirmed.subscribe(() => {
      this.subs.add(
        this.permissionsService.deleteRole(role.roleId).subscribe(result => {
          if (result.ok) {
            this.roles = this.roles.filter(r => r.roleId !== role.roleId);
            this.applyFilter();
            this.notification.success("success", 'Role deleted');
          } else {
            this.notification.error("Error", result.error.message);
          }
          this.cdr.markForCheck();
        })
      );
    });
  }
}
