// units-list.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { icons } from '../../../shared/icons-provider';
import { UnitService } from '../../../services/unit-service';
import { SystemService } from '../../../services/system-service';
import { CreateUnitDialog } from '../../../shared/components/modal/dialog/create-unit-dialog/create-unit-dialog';
import { EditUnitDialog } from '../../../shared/components/modal/dialog/edit-unit-dialog/edit-unit-dialog';
import { Confirmation } from '../../../shared/components/modal/dialog/confirmation/confirmation';

export type ViewMode = 'list' | 'grid';
export type UnitTab = 'all' | 'my' | 'shared';

// localStorage key for persisting view mode
const VIEW_MODE_KEY = 'units_view_mode';

export interface UnitRow {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  type: 'Owned' | 'Shared';
  createdAt: string;
  systemCount: number;
  checked: boolean;
  isDefault: boolean;
}

export interface SystemRow {
  id: string;
  name: string;
  systemCode: string;
  unitName: string;
  description: string;
  status: 'Active' | 'Inactive';
  type: 'Owned' | 'Shared';
  createdAt: string;
  checked: boolean;
}

@Component({
  selector: 'app-units-list',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzTagModule,
    NzDropDownModule,
    NzMenuModule,
    NzCheckboxModule,
    NzSelectModule,
    NzTabsModule,
    NzEmptyModule,
    NzToolTipModule,
    NzAvatarModule,
    CreateUnitDialog,
    EditUnitDialog,
    Confirmation,
  ],
  templateUrl: './units-list.html',
  styleUrl: './units-list.css',
})
export class UnitsList implements OnInit {
  /** Whether we're looking at a single unit detail or the full all-units list */
  isSingleUnit = false;
  singleUnitName = '';

  // ── Restore viewMode from localStorage on init ──────────────────────────
  viewMode: ViewMode = (localStorage.getItem(VIEW_MODE_KEY) as ViewMode) || 'list';

  activeTab: UnitTab = 'all';

  // helper property for nz-tabset (indexes correspond to all, my, shared)
  get selectedTabIndex(): number {
    switch (this.activeTab) {
      case 'my':
        return 1;
      case 'shared':
        return 2;
      case 'all':
      default:
        return 0;
    }
  }

  // ── Delete: optimistic removal then server confirm ───────────────────────
  onConfirmedDelete(): void {
    if (!this.pendingDeleteUnit) return;
    const unit = this.pendingDeleteUnit;
    this.pendingDeleteUnit = null;

    // 1. Optimistically remove from local array immediately
    this.allUnits = this.allUnits.filter((u) => u.id !== unit.id);

    this.unitService.deleteUnit(unit.id).subscribe({
      next: (resp) => {
        if (resp.code === 200) {
          this.notification.success(
            'Success',
            `${unit.name} has been deleted successfully`,
          );
          // Sync with server to ensure consistency
          this.loadUnits();
        } else {
          // Server rejected – restore the unit back
          this.allUnits = [...this.allUnits, unit];
          this.notification.error('Delete Failed', 'Server rejected the delete request');
        }
      },
      error: (err) => {
        // Revert optimistic removal on error
        this.allUnits = [...this.allUnits, unit];
        this.notification.error(
          'Delete Failed',
          err?.error?.message || 'Failed to delete unit',
          { nzDuration: 3000 },
        );
      },
    });
  }

  onTabIndexChange(index: number): void {
    const tabs: UnitTab[] = ['all', 'my', 'shared'];
    this.activeTab = tabs[index] || 'all';
  }

  unitSearch = '';
  systemSearch = '';

  statusFilter = '';
  typeFilter = '';

  allUnits: UnitRow[] = [];
  allSystems: SystemRow[] = [];

  /** For single-unit view — filtered systems belonging to that unit */
  singleUnitData: UnitRow | null = null;
  singleUnitSystems: SystemRow[] = [];

  // dialog and edit tracking
  @ViewChild('createUnitDialog') createUnitDialog!: CreateUnitDialog;
  @ViewChild('editUnitDialog') editUnitDialog!: EditUnitDialog;
  isEditMode = false;
  editingUnitId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private iconService: NzIconService,
    private unitService: UnitService,
    private systemService: SystemService,
    private notification: NzNotificationService,
  ) {
    this.iconService.addIcon(...icons);
  }

  // Pending unit for delete confirmation
  pendingDeleteUnit: UnitRow | null = null;

  // Confirmation dialog ref (ViewChild assigned via template)
  @ViewChild('confirmDialog') confirmDialog!: Confirmation;

  ngOnInit(): void {
    let currentSlug: string | null = null;
    this.route.params.subscribe((params) => {
      currentSlug = params['unitSlug'] || null;
      if (currentSlug) {
        this.isSingleUnit = true;
        this.singleUnitName = currentSlug
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c: string) => c.toUpperCase());
      } else {
        this.isSingleUnit = false;
      }
    });

    this.unitService.getUnitsList().subscribe({
      next: (resp) => {
        const unitsArray =
          resp?.data?.results?.units ?? resp?.data?.units ?? [];
        if (unitsArray && unitsArray.length) {
          this.allUnits = this.mapUnits(unitsArray);
          if (currentSlug) {
            this.singleUnitData =
              this.allUnits.find(
                (u) =>
                  u.name.toLowerCase().replace(/\s+/g, '-') === currentSlug,
              ) ?? null;
            this.singleUnitSystems = this.allSystems.filter(
              (s) =>
                s.unitName.toLowerCase().replace(/\s+/g, '-') === currentSlug,
            );
          }
        } else {
          this.allUnits = [];
        }
      },
      error: (error) => {
        console.error('Error loading units list:', error);
        this.notification.error(
          'Load Failed',
          error?.error?.message || 'Failed to load units list',
          { nzDuration: 3000 },
        );
      },
    });

    this.systemService.getSystemList().subscribe((resp) => {
      if (resp && resp.data && resp.data.systemlist) {
        this.allSystems = resp.data.systemlist.map((s: any) => ({
          id: s.id,
          name: s.name,
          systemCode: s.systemCode,
          unitName: s.unitName,
          description: s.description || '',
          status: s.status as 'Active' | 'Inactive',
          type: s.type as 'Owned' | 'Shared',
          createdAt: s.createdAt,
          checked: false,
        }));
        if (currentSlug) {
          this.singleUnitSystems = this.allSystems.filter(
            (s) =>
              s.unitName.toLowerCase().replace(/\s+/g, '-') === currentSlug,
          );
        }
      }
    });
  }

  // ── Shared mapping helper to avoid duplication ───────────────────────────
  private mapUnits(unitsArray: any[]): UnitRow[] {
    return unitsArray.map((u: any) => ({
      id: u.id,
      name: u.name,
      description: u.description ?? u.descrpt ?? '',
      status: (u.isActive ?? u.is_active) ? 'Active' : 'Inactive',
      type: ((u.type || '').charAt(0).toUpperCase() +
        (u.type || '').slice(1)) as 'Owned' | 'Shared',
      createdAt: ((u.createdAt ?? u.cretAt ?? u.cret_at) || '').split('T')[0],
      systemCount: u.systems ? u.systems.length : 0,
      checked: false,
      isDefault: (u.isDefault ?? u.is_default) || false,
    }));
  }

  get filteredUnits(): UnitRow[] {
    const filtered = this.allUnits.filter((u) => {
      const matchSearch =
        !this.unitSearch ||
        u.name.toLowerCase().includes(this.unitSearch.toLowerCase());
      const matchStatus = !this.statusFilter || u.status === this.statusFilter;
      const matchType = !this.typeFilter || u.type === this.typeFilter;
      const matchTab =
        this.activeTab === 'all'
          ? true
          : this.activeTab === 'my'
            ? u.type === 'Owned'
            : u.type === 'Shared';
      return matchSearch && matchStatus && matchType && matchTab;
    });

    // Active units first, then Inactive
    return filtered.sort((a, b) => {
      if (a.status === b.status) return 0;
      return a.status === 'Active' ? -1 : 1;
    });
  }

  get filteredSystems(): SystemRow[] {
    return this.allSystems.filter(
      (s) =>
        !this.systemSearch ||
        s.name.toLowerCase().includes(this.systemSearch.toLowerCase()),
    );
  }

  // ── setView now persists to localStorage ────────────────────────────────
  setView(mode: ViewMode): void {
    this.viewMode = mode;
    localStorage.setItem(VIEW_MODE_KEY, mode);
  }

  setTab(tab: UnitTab): void {
    this.activeTab = tab;
  }

  openUnit(unit: UnitRow): void {
    const slug = unit.name.toLowerCase().replace(/\s+/g, '-');
    this.router.navigate(['manage', 'units', slug]);
  }

  createUnit(): void {
    this.isEditMode = false;
    this.editingUnitId = null;
    this.createUnitDialog.showModal();
  }

  onUnitDialogConfirmed(formData: any): void {
    if (this.isEditMode && this.editingUnitId) {
      const targetId = this.editingUnitId;
      this.unitService
        .updateUnit(targetId, { description: formData.description })
        .subscribe({
          next: (resp) => {
            if (resp && resp.code === 200) {
              // ── Optimistic: patch the unit in-place immediately ──
              const idx = this.allUnits.findIndex((u) => u.id === targetId);
              if (idx !== -1) {
                this.allUnits[idx] = {
                  ...this.allUnits[idx],
                  description: formData.description,
                };
                this.allUnits = [...this.allUnits]; // trigger change detection
              }
              this.notification.success('Unit Updated', 'Unit has been updated successfully', {
                nzDuration: 3000,
              });
              
            }
            this.loadUnits(); // background sync
          },
          error: (err) => {
            this.notification.error(
              'Update Failed',
              err?.error?.message || 'Failed to update unit',
              { nzDuration: 3000 },
            );
          },
        });
    } else {
      const createData = { name: formData.unitName, description: formData.description };
      this.unitService.createUnit(createData).subscribe({
        next: (resp) => {
          if (resp && resp.code === 201) {
            this.notification.success('Unit Created', 'New unit has been created successfully', {
              nzDuration: 3000,
            });
            // loadUnits fetches the fresh list including the new unit
            this.loadUnits();
          }
        },
        error: (err) => {
          this.notification.error(
            'Creation Failed',
            err?.error?.message || 'Failed to create unit',
            { nzDuration: 3000 },
          );
        },
      });
    }
  }

  private loadUnits(): void {
    this.unitService.getUnitsList().subscribe((resp) => {
      const unitsArray = resp?.data?.results?.units ?? resp?.data?.units ?? [];
      this.allUnits = unitsArray.length ? this.mapUnits(unitsArray) : [];
    });
  }

  createSystem(): void {
    console.log('Create system');
  }

  onUnitEditConfirmed(formData: any): void {
    if (!this.editingUnitId) return;
    const targetId = this.editingUnitId;

    this.unitService
      .updateUnit(targetId, {
        description: formData.description,
        isDefault: formData.isDefault,
      })
      .subscribe({
        next: (resp) => {
          if (resp && resp.code === 200) {
            // ── Optimistic: patch the unit in-place immediately ──
            const idx = this.allUnits.findIndex((u) => u.id === targetId);
            if (idx !== -1) {
              this.allUnits[idx] = {
                ...this.allUnits[idx],
                description: formData.description,
                isDefault: formData.isDefault,
              };
              this.allUnits = [...this.allUnits]; // trigger change detection
            }
            this.notification.success('Unit Updated', 'Unit has been updated successfully', {
              nzDuration: 3000,
            });
            this.loadUnits(); // background sync
          }
        },
        error: (err) => {
          this.notification.error(
            'Update Failed',
            err?.error?.message || 'Failed to update unit',
            { nzDuration: 3000 },
          );
        },
      });
  }

  doUnitAction(action: string, unit: UnitRow): void {
    switch (action) {
      case 'details':
        this.openUnit(unit);
        break;

      case 'edit':
        this.editingUnitId = unit.id;
        this.editUnitDialog.showModal({
          description: unit.description,
          isDefault: unit.isDefault,
        });
        break;

      case 'toggle':
        const newStatus: 'Active' | 'Inactive' =
          unit.status === 'Active' ? 'Inactive' : 'Active';
        const targetStatusLabel = newStatus.toLowerCase();

        // ── Optimistic: flip status in local array immediately ──
        const idx = this.allUnits.findIndex((u) => u.id === unit.id);
        if (idx !== -1) {
          this.allUnits[idx] = { ...this.allUnits[idx], status: newStatus };
          this.allUnits = [...this.allUnits]; // trigger change detection
        }

        const apiCall =
          unit.status === 'Active'
            ? this.unitService.markUnitInactive(unit.id)
            : this.unitService.markUnitActive(unit.id);

        apiCall.subscribe({
          next: (resp) => {
            if (resp.code === 202) {
              this.notification.success(
                'Status Updated',
                `Unit is now ${targetStatusLabel}`,
                { nzDuration: 3000 },
              );
              this.loadUnits(); // background sync
            } else {
              // Revert optimistic change if server didn't accept
              if (idx !== -1) {
                this.allUnits[idx] = { ...this.allUnits[idx], status: unit.status };
                this.allUnits = [...this.allUnits];
              }
            }
          },
          error: (err) => {
            // Revert on error
            if (idx !== -1) {
              this.allUnits[idx] = { ...this.allUnits[idx], status: unit.status };
              this.allUnits = [...this.allUnits];
            }
            this.notification.error(
              'Update Failed',
              err?.error?.message || 'Failed to update unit status',
              { nzDuration: 3000 },
            );
          },
        });
        break;

      case 'delete':
        this.pendingDeleteUnit = unit;
        if (this.confirmDialog) {
          this.confirmDialog.title = 'Confirm Delete';
          this.confirmDialog.content = `Are you sure you want to delete "${unit.name}"? This action cannot be undone.`;
          this.confirmDialog.okColor = true;
          this.confirmDialog.okText = 'Delete';
          this.confirmDialog.cancelText = 'Cancel';
          this.confirmDialog.showConfirm();
        }
        break;
    }
  }

  doSystemAction(action: string, sys: SystemRow): void {
    console.log(action, sys);
  }
}