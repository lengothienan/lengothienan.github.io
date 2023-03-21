import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VbPhoiHopDoiChuaPhanXuLyDoiTruongComponent } from './vb-phoi-hop-doi-chua-phan-xu-ly-doi-truong.component';

describe('VbPhoiHopDoiChuaPhanXuLyDoiTruongComponent', () => {
  let component: VbPhoiHopDoiChuaPhanXuLyDoiTruongComponent;
  let fixture: ComponentFixture<VbPhoiHopDoiChuaPhanXuLyDoiTruongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VbPhoiHopDoiChuaPhanXuLyDoiTruongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VbPhoiHopDoiChuaPhanXuLyDoiTruongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
