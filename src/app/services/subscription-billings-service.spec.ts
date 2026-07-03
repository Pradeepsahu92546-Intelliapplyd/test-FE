import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SubscriptionBillingsService } from './subscription-billings-service';

describe('SubscriptionBillingsService', () => {
  let service: SubscriptionBillingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(SubscriptionBillingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
