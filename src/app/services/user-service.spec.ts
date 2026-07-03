import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UserService } from './user-service';
import { Auth } from './auth/auth';

describe('UserService', () => {
  let service: UserService;
  let authServiceMock: jasmine.SpyObj<Auth>;

  beforeEach(() => {
    // Create a spy object for the Auth service.
    // You can add methods that your UserService uses from Auth, like 'getToken'.
    authServiceMock = jasmine.createSpyObj('Auth', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: Auth, useValue: authServiceMock },
      ],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
