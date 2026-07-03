import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { UnitService } from '../../../../services/unit-service';
import { SystemService } from '../../../../services/system-service';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

interface Unit {
  id: string;
  name: string;
  createdAt: string;
  isActive: boolean;
  type: 'owned' | 'shared';
  description: string;
  isDefault: boolean;
  createdBy: string;
  system: any[];
  currentSubscription: {
    planName: string;
    status: string;
    validUntil: string;
  };
}

interface System {
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
  selector: 'app-unit-selector',
  imports: [
    CommonModule,
    NzMenuModule,
    NzIconModule,
    NzTreeModule,
    NzAvatarModule,
    NzDropDownModule,
    NzTagModule,
    NzButtonModule,
    NzInputModule,
    NzSelectModule,
    FormsModule,
    NzDividerModule,
    NzTabsModule,
  ],
  templateUrl: './unit-selector.html',
  styleUrl: './unit-selector.css',
})
export class UnitSelector implements OnInit {
  @Input() isCollapsed = false;
  @Output() unitSelected = new EventEmitter<any>();
  @Output() systemSelected = new EventEmitter<any>();

  units: Unit[] = [];
  systems: System[] = [];
  filteredUnits: Unit[] = [];
  searchTerm = '';
  selectedTab: 'all' | 'owned' | 'shared' = 'all';
  selectedUnitFilter: string = 'all'; // Can be 'all' or a unit ID
  expandedKeys: string[] = [];
  treeNodes: NzTreeNodeOptions[] = [];

  // Define the tab order for mapping indexes (0, 1, 2) to strings
  private tabMap: ('all' | 'owned' | 'shared')[] = ['all', 'owned', 'shared'];

  constructor(
    private unitService: UnitService,
    private systemService: SystemService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.unitService.getUnitsList().subscribe((response) => {
      if (response.code === 200) {
        const arr = response.data?.results?.units ?? response.data?.units ?? [];
        this.units = arr;
        this.applyFilters();
      }
    });

    this.systemService.getSystemList().subscribe((response) => {
      if (response.code === 200) {
        this.systems = response.data.systemlist || [];
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    // Filter units based on tab, search, and unit filter
    this.filteredUnits = this.units.filter((unit) => {
      const matchesTab =
        this.selectedTab === 'all' || unit.type === this.selectedTab;
      const matchesSearch =
        !this.searchTerm ||
        unit.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.systems.some(
          (sys) =>
            sys.unitName === unit.name &&
            sys.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
        );
      const matchesUnitFilter =
        this.selectedUnitFilter === 'all' || unit.id === this.selectedUnitFilter;
      return matchesTab && matchesSearch && matchesUnitFilter;
    });

    // Build tree nodes
    this.treeNodes = this.filteredUnits.map((unit) => {
      const unitSystems = this.systems.filter((sys) => sys.unitName === unit.name);
      const children =
        unitSystems.length > 0
          ? unitSystems.map((sys) => ({
              title: sys.name,
              key: `${unit.id}-${sys.id}`,
              icon: 'appstore',
              isLeaf: true,
            }))
          : [
              {
                title: 'No system created',
                key: `${unit.id}-no-system`,
                icon: 'info-circle',
                isLeaf: true,
                disabled: true,
              },
            ];

      return {
        title: unit.name,
        key: unit.id,
        icon: 'apartment',
        expanded: this.expandedKeys.includes(unit.id),
        children,
      };
    });

    // Auto-expand if only one unit
    if (this.treeNodes.length === 1) {
      this.expandedKeys = [this.treeNodes[0].key];
    }
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  getTabIndex(tab: 'all' | 'owned' | 'shared'): number {
    return this.tabMap.indexOf(tab);
  }

  // Add this to handle the (nzSelectedIndexChange) event from the template
  onTabIndexChange(index: number): void {
    const newTab = this.tabMap[index];
    this.onTabChange(newTab);
  }

  onTabChange(tab: 'all' | 'owned' | 'shared'): void {
    this.selectedTab = tab;
    this.applyFilters();
  }

  onUnitFilterChange(filter: string): void {
    this.selectedUnitFilter = filter;
    this.applyFilters();
  }

  getSelectedUnitLabel(): string {
    if (this.selectedUnitFilter === 'all') {
      return 'All units';
    }
    const unit = this.units.find((u) => u.id === this.selectedUnitFilter);
    return unit ? unit.name : 'Select unit';
  }

  onNodeClick(event: any): void {
    const node = event.node;
    if (node.isLeaf) {
      // System clicked
      const [unitId, systemId] = node.key.split('-');
      const system = this.systems.find((s) => s.id === systemId);
      if (system) {
        this.systemSelected.emit(system);
      }
    } else {
      // Unit clicked
      const unit = this.units.find((u) => u.id === node.key);
      if (unit) {
        this.unitSelected.emit(unit);
      }
    }
  }

  getTabCount(tab: 'all' | 'owned' | 'shared'): number {
    if (tab === 'all') return this.units.length;
    return this.units.filter((u) => u.type === tab).length;
  }
}
