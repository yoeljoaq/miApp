import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarvehiculoPage } from './agregarvehiculo.page';

describe('AgregarvehiculoPage', () => {
  let component: AgregarvehiculoPage;
  let fixture: ComponentFixture<AgregarvehiculoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarvehiculoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
