import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonDataComponent } from './addon-data.component';

describe('AddonDataComponent', () => {
  let component: AddonDataComponent;
  let fixture: ComponentFixture<AddonDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddonDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
