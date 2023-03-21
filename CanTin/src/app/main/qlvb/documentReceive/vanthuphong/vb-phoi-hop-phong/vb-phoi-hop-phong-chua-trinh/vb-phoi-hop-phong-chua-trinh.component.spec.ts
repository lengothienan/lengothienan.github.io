import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VbPhoiHopPhongChuaTrinhComponent } from './vb-phoi-hop-phong-chua-trinh.component';

describe('VbPhoiHopPhongChuaTrinhComponent', () => {
  let component: VbPhoiHopPhongChuaTrinhComponent;
  let fixture: ComponentFixture<VbPhoiHopPhongChuaTrinhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VbPhoiHopPhongChuaTrinhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VbPhoiHopPhongChuaTrinhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
