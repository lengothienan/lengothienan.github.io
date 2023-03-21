import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VbPhoihopPhongComponent } from './vb-phoihop-phong.component';

describe('VbPhoihopPhongComponent', () => {
  let component: VbPhoihopPhongComponent;
  let fixture: ComponentFixture<VbPhoihopPhongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VbPhoihopPhongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VbPhoihopPhongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
