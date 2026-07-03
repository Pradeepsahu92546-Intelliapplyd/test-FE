import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Register } from './register';

describe('RegisterComponent - UNIT TESTS', () => {
  let component: Register;
    let fixture: ComponentFixture<Register>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Register],
        providers: [provideHttpClientTesting(), provideHttpClient()]
      })
      .compileComponents();
  
      fixture = TestBed.createComponent(Register);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
});