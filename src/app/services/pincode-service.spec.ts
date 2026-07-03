import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PincodeService } from './pincode-service';

describe('PincodeService', () => {
  let service: PincodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(PincodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
