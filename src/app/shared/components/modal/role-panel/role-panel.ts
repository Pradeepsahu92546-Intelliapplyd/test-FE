import {
  Component, Input, Output, EventEmitter,
  OnInit, OnChanges, OnDestroy, SimpleChanges,
  ChangeDetectionStrategy, ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { CommonModule }       from '@angular/common';
import {
  FormsModule, ReactiveFormsModule,
  FormBuilder, FormGroup, Validators,
} from '@angular/forms';
import { NzButtonModule }     from 'ng-zorro-antd/button';
import { NzInputModule }      from 'ng-zorro-antd/input';
import { NzTagModule }        from 'ng-zorro-antd/tag';
import { NzCheckboxModule }   from 'ng-zorro-antd/checkbox';
import { NzCollapseModule }   from 'ng-zorro-antd/collapse';
import { NzIconModule }       from 'ng-zorro-antd/icon';
import { NzSkeletonModule }   from 'ng-zorro-antd/skeleton';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription }       from 'rxjs';

import { PermissionsService } from '../../../../services/permissions-service';
import { RoleDetailsModel, CompositionItemModel } from '../../../../dto/models/unit-permissions.model';
import { Confirmation }       from '../dialog/confirmation/confirmation';

export type PanelMode = 'details' | 'create' | 'edit';

@Component({
  selector: 'app-role-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NzButtonModule, NzInputModule, NzTagModule,
    NzCheckboxModule, NzCollapseModule, NzIconModule,
    NzSkeletonModule, Confirmation,
  ],
  templateUrl: './role-panel.html',
  styleUrl: './role-panel.css',
})
export class RolePanel implements OnInit, OnChanges, OnDestroy {
  @ViewChild('confirmDialog') confirmDialog!: Confirmation;

  @Input() mode: PanelMode              = 'details';
  @Input() role: RoleDetailsModel | null = null;

  @Output() close        = new EventEmitter<void>();
  @Output() roleCreated  = new EventEmitter<RoleDetailsModel>();
  @Output() roleUpdated  = new EventEmitter<RoleDetailsModel>();
  @Output() roleDeleted  = new EventEmitter<string>();
  @Output() roleCloned   = new EventEmitter<RoleDetailsModel>();

  form!: FormGroup;
  predefinedRoles:  RoleDetailsModel[] = [];
  selectedRoleIds:  Set<string>        = new Set();

  isLoadingRoles = false;
  isSaving       = false;
  isDeleting     = false;
  isCloning      = false;

  /**
   * When user clicks "Edit" inside a details panel, we switch
   * to inline edit without the parent needing to re-open the panel.
   * This flag is LOCAL to the panel — parent mode input stays 'details'.
   */
  isInlineEditing = false;

  private subs = new Subscription();

  constructor(
    private fb:                 FormBuilder,
    private permissionsService: PermissionsService,
    private notification:       NzNotificationService,
    private cdr:                ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPredefinedRoles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // When parent changes the role or mode, reset inline edit state
    if (changes['role'] || changes['mode']) {
      this.isInlineEditing = false;
      this.initForm();
      this.syncSelectedIds();
    }
  }

  ngOnDestroy(): void { this.subs.unsubscribe(); }

  // ── Computed state ────────────────────────────────────────────────────────

  /** True raw details view (not editing) */
  get isReadOnly(): boolean {
    return this.mode === 'details' && !this.isInlineEditing;
  }

  get isCreate():    boolean { return this.mode === 'create'; }

  /** Edit = either parent opened in edit mode, OR user clicked Edit inside details */
  get isEditActive(): boolean {
    return this.mode === 'edit' || this.isInlineEditing;
  }

  get isPredefined(): boolean { return !!this.role && !this.role.isCustom; }

  get panelTitle(): string {
    if (this.isCreate) return 'Create Custom Role';
    return 'Role details';
  }

  get panelSubtitle(): string {
    if (this.isCreate) return 'This role can be edited or deleted.';
    return '';
  }

  get tagLabel(): string {
    if (this.isCreate) return '';
    return this.isPredefined ? 'Predefined' : 'Custom';
  }

  get tagColor(): string {
    return this.isPredefined ? 'green' : 'blue';
  }

  get f() { return this.form.controls; }

  // ── Form ──────────────────────────────────────────────────────────────────

  private initForm(): void {
    // Disable fields when in pure read-only details view
    const disabled = this.mode === 'details' && !this.isInlineEditing;
    this.form = this.fb.group({
      roleName:    [{ value: this.role?.roleName    ?? '', disabled }, Validators.required],
      description: [{ value: this.role?.description ?? '', disabled }, Validators.required],
    });
  }

  private syncSelectedIds(): void {
    this.selectedRoleIds = new Set(
      (this.role?.composition ?? []).map(c => c.id),
    );
  }

  // ── Inline edit toggle (Details → Edit without closing panel) ─────────────

  enableInlineEdit(): void {
    this.isInlineEditing = true;
    this.form.get('roleName')?.enable();
    this.form.get('description')?.enable();
    this.cdr.markForCheck();
  }

  cancelInlineEdit(): void {
    this.isInlineEditing = false;
    // Restore original values
    this.form.patchValue({
      roleName:    this.role?.roleName    ?? '',
      description: this.role?.description ?? '',
    });
    this.form.get('roleName')?.disable();
    this.form.get('description')?.disable();
    this.syncSelectedIds();
    this.cdr.markForCheck();
  }

  // ── Load predefined roles ─────────────────────────────────────────────────

  private loadPredefinedRoles(): void {
    this.isLoadingRoles = true;
    this.subs.add(
      this.permissionsService.getRolesList().subscribe(result => {
        if (result.ok) {
          this.predefinedRoles = result.data.roles.filter(r => !r.isCustom);
          this.syncSelectedIds();
        }
        this.isLoadingRoles = false;
        this.cdr.markForCheck();
      }),
    );
  }

  // ── Checkbox ──────────────────────────────────────────────────────────────

  toggleRole(roleId: string): void {
    if (this.isReadOnly) return;   // ← blocked in read-only; allowed in both edit modes
    if (this.selectedRoleIds.has(roleId)) {
      this.selectedRoleIds.delete(roleId);
    } else {
      this.selectedRoleIds.add(roleId);
    }
    this.cdr.markForCheck();
  }

  isSelected(roleId: string): boolean {
    return this.selectedRoleIds.has(roleId);
  }

  // ── Create ────────────────────────────────────────────────────────────────

  createRole(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isSaving = true;
    this.cdr.markForCheck();

    const composition = this.buildComposition();
    this.subs.add(
      this.permissionsService.addRole({
        roleName:    this.form.getRawValue().roleName,
        description: this.form.getRawValue().description,
        composition,
      }).subscribe(result => {
        if (result.ok) {
          this.roleCreated.emit(result.data);
          this.notification.success('Success', 'Role created successfully');
        } else {
          this.notification.error('Error', result.error.message);
        }
        this.isSaving = false;
        this.cdr.markForCheck();
      }),
    );
  }

  // ── Update ────────────────────────────────────────────────────────────────

  updateRole(): void {
    if (this.form.invalid || !this.role) { this.form.markAllAsTouched(); return; }
    this.isSaving = true;
    this.cdr.markForCheck();

    const composition = this.buildComposition();
    this.subs.add(
      this.permissionsService.updateRole(this.role.roleId, {
        roleName:    this.form.getRawValue().roleName,
        description: this.form.getRawValue().description,
        composition,
      }).subscribe(result => {
        if (result.ok) {
          this.roleUpdated.emit(result.data);
          this.notification.success('Success', 'Role updated successfully');
        } else {
          this.notification.error('Error', result.error.message);
        }
        this.isSaving = false;
        this.cdr.markForCheck();
      }),
    );
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  deleteRole(): void {
    if (!this.role) return;
    this.confirmDialog.title   = 'Delete Role';
    this.confirmDialog.content = `Are you sure you want to delete "${this.role.roleName}"? This action cannot be undone.`;
    this.confirmDialog.okColor = true;
    this.confirmDialog.showConfirm();

    // Subscribe once — use take(1) equivalent via a local sub
    const deleteSub = this.confirmDialog.confirmed.subscribe(() => {
      this.isDeleting = true;
      this.cdr.markForCheck();
      this.subs.add(
        this.permissionsService.deleteRole(this.role!.roleId).subscribe(result => {
          if (result.ok) {
            this.roleDeleted.emit(this.role!.roleId);
            this.notification.success('Success', 'Role deleted successfully');
          } else {
            this.notification.error('Error', result.error.message);
          }
          this.isDeleting = false;
          this.cdr.markForCheck();
        }),
      );
      deleteSub.unsubscribe();   // ← prevent stacking on repeated opens
    });
  }

  // ── Clone ─────────────────────────────────────────────────────────────────

  cloneRole(): void {
    if (!this.role) return;
    this.isCloning = true;
    this.cdr.markForCheck();

    this.subs.add(
      this.permissionsService.cloneRole(this.role.roleId).subscribe(result => {
        if (result.ok) {
          this.roleCloned.emit(result.data);
          this.notification.success('Success', `Role cloned as "${result.data.roleName}"`);
        } else {
          this.notification.error('Error', result.error.message);
        }
        this.isCloning = false;
        this.cdr.markForCheck();
      }),
    );
  }

  onClose(): void { this.close.emit(); }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private buildComposition(): CompositionItemModel[] {
    return this.predefinedRoles
      .filter(r => this.selectedRoleIds.has(r.roleId))
      .map(r => ({ id: r.roleId, name: r.roleName }));
  }
}