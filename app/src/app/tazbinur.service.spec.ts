import { TestBed } from '@angular/core/testing';

import { TazbinurService } from './tazbinur.service';

describe('TazbinurService', () => {
  let service: TazbinurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TazbinurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
