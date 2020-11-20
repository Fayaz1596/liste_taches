import { TestBed } from '@angular/core/testing';

import { WebRequeteIntercepteurService } from './web-requete-intercepteur.service';

describe('WebRequeteIntercepteurService', () => {
  let service: WebRequeteIntercepteurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebRequeteIntercepteurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
