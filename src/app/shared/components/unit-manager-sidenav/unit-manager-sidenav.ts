import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, map } from 'rxjs/operators';
import { icons } from '../../icons-provider';
import { NzSelectComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { UnitService } from '../../../services/unit-service';
import { UserHeader } from '../global/user-header/user-header';


// Define the Unit interface
export interface Unit {
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

@Component({
  selector: 'app-unit-manager-sidenav',
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    NzAvatarModule,
    NzButtonModule,
    NzToolTipModule,
    NzBadgeModule,
    NzBreadCrumbModule,
    NzDropDownModule,
    NzTagModule,
    NzSelectComponent,
    NzSelectModule,
    FormsModule,
    UserHeader,
    RouterModule
  ],
  templateUrl: './unit-manager-sidenav.html',
  styleUrl: './unit-manager-sidenav.css',
})
export class UnitManagerSidenav implements OnInit {
  isCollapsed = false;

  // Selected unit filter: 'all' or unit id
  selectedUnitId: string = 'all';

  // Current breadcrumb path
  breadcrumbs: { label: string; link?: string }[] = [];

  // units will be loaded from service
  units: Unit[] = [];

  // Flat nav items — always visible
  navItems = [
    { label: 'Units',                    icon: 'sandbox', link: 'units',                        exact: true  },
    { label: 'Teams and member',         icon: 'team',            link: 'teams',                        exact: false },
    { label: 'Permission Access',        icon: 'solution',          link: null,  hasChildren: true,        open: true   },
    { label: 'Request to System creation', icon: 'sub-node',   link: 'requests',                     exact: false },
    { label: 'Billings',                 icon: 'credit-card',     link: 'billings',                     exact: false },
    { label: 'Subscription Plan Settings', icon: 'crown',      link: 'subscription',                 exact: false },
  ];

  permissionChildren = [
    { label: 'Rules',     link: 'permissions/rules'     },
    { label: 'Roles',     link: 'permissions/roles'     },
    { label: 'Resources', link: 'permissions/resources' },
  ];

  constructor(private iconService: NzIconService, private router: Router, private route: ActivatedRoute, private unitService: UnitService) {
    this.iconService.addIcon(...icons);
  }

  ngOnInit(): void {
    this.updateBreadcrumbs(this.router.url);
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => this.updateBreadcrumbs(e.urlAfterRedirects));

    // load units from service
    this.unitService.getUnitsList().subscribe((resp) => {
      const unitsArray = resp?.data?.results?.units ?? resp?.data?.units ?? [];
      if (unitsArray && unitsArray.length) {
        this.units = unitsArray.map((u: any) => ({
          id: u.id,
          name: u.name,
          createdAt: u.createdAt ?? u.cretAt ?? u.cret_at,
          isActive: u.isActive ?? u.is_active,
          type: u.type,
          description: u.description ?? u.descrpt ?? '',
          isDefault: (u.isDefault ?? u.is_default) || false,
          createdBy: u.createdBy,
          system: u.systems || [],
          currentSubscription: u.currentSubscription,
        }));
      } else {
        this.units = [];
      }
    });
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  goBack(): void {
    // navigatr to dashborad home
     this.router.navigate(['/dashboard-home']);
  }


  onUnitChange(value: string): void {
    this.selectedUnitId = value;
    if (value === 'all') {
      this.router.navigate(['manage', 'units']);
    } else {
      const unit = this.units.find(u => u.id === value);
      if (unit) {
        this.router.navigate(['manage', 'units', unit.name.toLowerCase().replace(/\s+/g, '-')]);
      }
    }
  }

  /**
   * compute routerLink array for the Units menu item based on current selection
   */
  get unitsMenuLink(): any[] {
    if (this.selectedUnitId === 'all') {
      return ['/units'];
    }
    const unit = this.units.find(u => u.id === this.selectedUnitId);
    if (!unit) {
      return ['/units'];
    }
    const slug = unit.name.toLowerCase().replace(/\s+/g, '-');
    return ['/units', slug];
  }

  get selectedUnitLabel(): string {
    if (this.selectedUnitId === 'all') return 'All units';
    return this.units.find(u => u.id === this.selectedUnitId)?.name ?? 'All units';
  }

  private updateBreadcrumbs(url: string): void {
    const segments = url.replace(/^\//, '').split('/').filter(Boolean);
    this.breadcrumbs = segments.map((seg, i) => ({
      label: seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      link: '/' + segments.slice(0, i + 1).join('/'),
    }));
  }


  navigateToDashboard() {
    this.router.navigate(['/dashboard-home']);
  }

  
}








