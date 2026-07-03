import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AuthShell } from './auth-shell';

describe('AuthShell', () => {
  let component: AuthShell;
  let fixture: ComponentFixture<AuthShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthShell, HttpClientTestingModule, NoopAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component).toBeDefined();
  });

  it('failed test case',() => {
    expect(component).toBeFalsy();
  }); 
 it('failed test case2',() => {
    expect(component).toBeFalsy();
  }); 


});
