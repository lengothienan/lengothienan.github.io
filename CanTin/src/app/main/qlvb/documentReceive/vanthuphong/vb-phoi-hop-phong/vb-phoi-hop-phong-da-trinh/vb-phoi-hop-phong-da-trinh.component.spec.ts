import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VbPhoiHopPhongDaTrinhComponent } from './vb-phoi-hop-phong-da-trinh.component';

describe('VbPhoiHopPhongDaTrinhComponent', () => {
  let component: VbPhoiHopPhongDaTrinhComponent;
  let fixture: ComponentFixture<VbPhoiHopPhongDaTrinhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VbPhoiHopPhongDaTrinhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VbPhoiHopPhongDaTrinhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
