import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VbPhoiHopCbcsDaXuLyComponent } from './vb-phoi-hop-cbcs-da-xu-ly.component';

describe('VbPhoiHopCbcsDaXuLyComponent', () => {
  let component: VbPhoiHopCbcsDaXuLyComponent;
  let fixture: ComponentFixture<VbPhoiHopCbcsDaXuLyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VbPhoiHopCbcsDaXuLyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VbPhoiHopCbcsDaXuLyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
