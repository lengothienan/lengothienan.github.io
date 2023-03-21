import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VbPhoihopDoiComponent } from './vb-phoihop-doi.component';

describe('VbPhoihopDoiComponent', () => {
  let component: VbPhoihopDoiComponent;
  let fixture: ComponentFixture<VbPhoihopDoiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VbPhoihopDoiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VbPhoihopDoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
