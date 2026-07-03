import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { icons } from '../../icons-provider';
import { Router } from '@angular/router';
import { UserHeader } from '../global/user-header/user-header';
import { UnitSelector } from '../global/unit-selector/unit-selector';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-main-side-nav',
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
    NzTooltipModule,
    NzDividerModule,
    UserHeader,
    UnitSelector,
  ],
  templateUrl: './main-side-nav.html',
  styleUrl: './main-side-nav.css',
})
export class MainSideNav implements OnInit {


  /** Controls whether the sidebar is in collapsed (icon-only) mode */
  isCollapsed = false;

  constructor(
    private iconService: NzIconService,
    private router: Router,
  ) {
    this.iconService.addIcon(...icons);
  }

  ngOnInit(): void {
    // user header will handle profile loading
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  onUnitSelected(unit: any): void {
    console.log('Unit selected:', unit);
    // Handle unit selection logic here
  }

  onSystemSelected(system: any): void {
    console.log('System selected:', system);
    // Handle system selection logic here
  }

  navigateToAccountSettings(): void {
    this.router.navigateByUrl('/user/profile');
  }

  navigateToUnitManager(): void {
    this.router.navigateByUrl('/manage/units');
  }
}
