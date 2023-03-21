import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VbPhoiHopDoiDaPhanXuLyDoiTruongComponent } from './vb-phoi-hop-doi-da-phan-xu-ly-doi-truong.component';

describe('VbPhoiHopDoiDaPhanXuLyDoiTruongComponent', () => {
  let component: VbPhoiHopDoiDaPhanXuLyDoiTruongComponent;
  let fixture: ComponentFixture<VbPhoiHopDoiDaPhanXuLyDoiTruongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VbPhoiHopDoiDaPhanXuLyDoiTruongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VbPhoiHopDoiDaPhanXuLyDoiTruongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
