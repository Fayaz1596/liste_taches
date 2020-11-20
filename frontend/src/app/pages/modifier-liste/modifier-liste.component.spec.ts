import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierListeComponent } from './modifier-liste.component';

describe('ModifierListeComponent', () => {
  let component: ModifierListeComponent;
  let fixture: ComponentFixture<ModifierListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifierListeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
