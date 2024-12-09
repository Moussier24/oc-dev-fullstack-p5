import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { FormComponent } from './form.component';
import { of } from 'rxjs';
import { TeacherService } from '../../../../services/teacher.service';
import { Session } from '../../interfaces/session.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;
  let router: Router;
  let matSnackBar: MatSnackBar;

  const mockSession: Session = {
    id: 1,
    name: 'Test Session',
    description: 'Test Description',
    date: new Date(),
    teacher_id: 1,
    users: [],
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true,
    },
  };

  const mockSessionApiService = {
    create: jest.fn(),
    update: jest.fn(),
    detail: jest.fn(),
  };

  const mockTeacherService = {
    all: jest.fn().mockReturnValue(of([])),
  };

  const mockMatSnackBar = {
    open: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
    url: '',
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      declarations: [FormComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);
    router = TestBed.inject(Router);
    matSnackBar = TestBed.inject(MatSnackBar);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect if user is not admin', () => {
    mockSessionService.sessionInformation.admin = false;
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  describe('Create Mode', () => {
    beforeEach(() => {
      mockRouter.url = '/sessions/create';
      fixture.detectChanges();
    });

    it('should initialize form in create mode', () => {
      component.ngOnInit();
      expect(component.onUpdate).toBeFalsy();
      expect(component.sessionForm).toBeDefined();
    });

    it('should create session when form is submitted', () => {
      mockSessionApiService.create.mockReturnValue(of(mockSession));
      component.ngOnInit();

      component.sessionForm?.patchValue({
        name: 'Test Session',
        description: 'Test Description',
        date: '2024-03-20',
        teacher_id: 1,
      });

      component.submit();

      expect(mockSessionApiService.create).toHaveBeenCalled();
      expect(mockMatSnackBar.open).toHaveBeenCalledWith(
        'Session created !',
        'Close',
        { duration: 3000 }
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
    });
  });

  describe('Update Mode', () => {
    beforeEach(() => {
      mockRouter.url = '/sessions/update/1';
      mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('1');
      mockSessionApiService.detail.mockReturnValue(of(mockSession));
      fixture.detectChanges();
    });

    it('should initialize form in update mode', () => {
      component.ngOnInit();
      expect(component.onUpdate).toBeTruthy();
      expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    });

    it('should update session when form is submitted', () => {
      mockSessionApiService.update.mockReturnValue(of(mockSession));
      component.ngOnInit();

      component.sessionForm?.patchValue({
        name: 'Updated Session',
        description: 'Updated Description',
        date: '2024-03-21',
        teacher_id: 2,
      });

      component.submit();

      expect(mockSessionApiService.update).toHaveBeenCalled();
      expect(mockMatSnackBar.open).toHaveBeenCalledWith(
        'Session updated !',
        'Close',
        { duration: 3000 }
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      mockRouter.url = '/sessions/create';
      component.ngOnInit();
    });

    it('should have invalid form when empty', () => {
      component.sessionForm?.patchValue({
        name: '',
        description: '',
        date: '',
        teacher_id: '',
      });

      Object.keys(component.sessionForm?.controls || {}).forEach((key) => {
        const control = component.sessionForm?.get(key);
        control?.markAsTouched();
      });

      expect(component.sessionForm?.valid).toBeFalsy();
      expect(
        component.sessionForm?.get('name')?.errors?.['required']
      ).toBeTruthy();
      expect(
        component.sessionForm?.get('description')?.errors?.['required']
      ).toBeTruthy();
      expect(
        component.sessionForm?.get('date')?.errors?.['required']
      ).toBeTruthy();
      expect(
        component.sessionForm?.get('teacher_id')?.errors?.['required']
      ).toBeTruthy();
    });

    it('should have valid form when all fields are filled correctly', () => {
      component.sessionForm?.patchValue({
        name: 'Test Session',
        description: 'Valid description',
        date: '2024-03-20',
        teacher_id: 1,
      });

      expect(component.sessionForm?.valid).toBeTruthy();
      expect(component.sessionForm?.get('name')?.errors).toBeNull();
      expect(component.sessionForm?.get('description')?.errors).toBeNull();
      expect(component.sessionForm?.get('date')?.errors).toBeNull();
      expect(component.sessionForm?.get('teacher_id')?.errors).toBeNull();
    });

    it('should be invalid when description exceeds 2000 characters', () => {
      component.sessionForm?.patchValue({
        name: 'Test Session',
        description: 'A'.repeat(2001),
        date: '2024-03-20',
        teacher_id: 1,
      });

      expect(component.sessionForm?.get('description')?.valid).toBeFalsy();
      expect(
        component.sessionForm?.get('description')?.errors?.['maxlength']
      ).toBeTruthy();
    });

    it('should validate each required field individually', () => {
      component.sessionForm?.patchValue({
        name: '',
        description: 'Valid description',
        date: '2024-03-20',
        teacher_id: 1,
      });
      expect(
        component.sessionForm?.get('name')?.errors?.['required']
      ).toBeTruthy();

      component.sessionForm?.patchValue({
        name: 'Test Session',
        description: '',
        date: '2024-03-20',
        teacher_id: 1,
      });
      expect(
        component.sessionForm?.get('description')?.errors?.['required']
      ).toBeTruthy();

      component.sessionForm?.patchValue({
        name: 'Test Session',
        description: 'Valid description',
        date: '',
        teacher_id: 1,
      });
      expect(
        component.sessionForm?.get('date')?.errors?.['required']
      ).toBeTruthy();

      component.sessionForm?.patchValue({
        name: 'Test Session',
        description: 'Valid description',
        date: '2024-03-20',
        teacher_id: '',
      });
      expect(
        component.sessionForm?.get('teacher_id')?.errors?.['required']
      ).toBeTruthy();
    });
  });
});
