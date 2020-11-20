import { TestBed } from '@angular/core/testing';

import { RequeteWebService } from './requete-web.service';

describe('RequeteWebService', () => {
  let service: RequeteWebService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequeteWebService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
