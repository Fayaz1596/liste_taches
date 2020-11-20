import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleListeComponent } from './nouvelle-liste.component';

describe('NouvelleListeComponent', () => {
  let component: NouvelleListeComponent;
  let fixture: ComponentFixture<NouvelleListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouvelleListeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NouvelleListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
