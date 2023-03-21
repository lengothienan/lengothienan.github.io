import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VbPhoiHopCbcsChuaXuLyComponent } from './vb-phoi-hop-cbcs-chua-xu-ly.component';

describe('VbPhoiHopCbcsChuaXuLyComponent', () => {
  let component: VbPhoiHopCbcsChuaXuLyComponent;
  let fixture: ComponentFixture<VbPhoiHopCbcsChuaXuLyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VbPhoiHopCbcsChuaXuLyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VbPhoiHopCbcsChuaXuLyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
