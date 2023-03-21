import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileHdsdComponent } from './upload-file-hdsd.component';

describe('UploadFileHdsdComponent', () => {
  let component: UploadFileHdsdComponent;
  let fixture: ComponentFixture<UploadFileHdsdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFileHdsdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileHdsdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
