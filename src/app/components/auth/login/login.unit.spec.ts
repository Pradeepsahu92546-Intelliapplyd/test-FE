import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Login } from './login';


describe('LoginComponent - UNIT TESTS', () => {
  let component: Login;
    let fixture: ComponentFixture<Login>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Login],
        providers: [provideHttpClientTesting(), provideHttpClient()]
      })
      .compileComponents();
  
      fixture = TestBed.createComponent(Login);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
});