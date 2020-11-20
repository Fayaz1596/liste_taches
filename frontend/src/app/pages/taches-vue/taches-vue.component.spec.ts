import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TachesVueComponent } from './taches-vue.component';

describe('TachesVueComponent', () => {
  let component: TachesVueComponent;
  let fixture: ComponentFixture<TachesVueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TachesVueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TachesVueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
