import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTrailerComponent } from './modal-trailer.component';

describe('ModalTrailerComponent', () => {
  let component: ModalTrailerComponent;
  let fixture: ComponentFixture<ModalTrailerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTrailerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTrailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
