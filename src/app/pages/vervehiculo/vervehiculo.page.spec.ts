import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VervehiculoPage } from './vervehiculo.page';

describe('VervehiculoPage', () => {
  let component: VervehiculoPage;
  let fixture: ComponentFixture<VervehiculoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VervehiculoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
