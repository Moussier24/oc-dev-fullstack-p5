import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { FormComponent } from './form.component';
import { By } from '@angular/platform-browser';
import { Session } from '../../interfaces/session.interface';
import { Teacher } from 'src/app/interfaces/teacher.interface';

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
    date: new Date('2024-03-20'),
    teacher_id: 1,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTeachers: Teacher[] = [
    {
      id: 1,
      lastName: 'Doe',
      firstName: 'John',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      lastName: 'Smith',
      firstName: 'Jane',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

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
    all: jest.fn().mockReturnValue(of(mockTeachers)),
  };

  const mockRouter = {
    navigate: jest.fn(),
    url: '',
  };

  const mockMatSnackBar = {
    open: jest.fn(),
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('1'),
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
      ],
      providers: [
        FormBuilder,
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
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

    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should redirect if user is not admin', () => {
      mockSessionService.sessionInformation.admin = false;
      component.ngOnInit();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    });

    it('should initialize create form', () => {
      mockRouter.url = '/sessions/create';
      component.ngOnInit();
      expect(component.onUpdate).toBeFalsy();
      expect(component.sessionForm).toBeDefined();
    });

    it('should initialize update form', () => {
      mockRouter.url = '/sessions/update/1';
      mockSessionApiService.detail.mockReturnValue(of(mockSession));
      component.ngOnInit();
      expect(component.onUpdate).toBeTruthy();
      expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    });

    it('should load teachers list', () => {
      component.ngOnInit();
      component.teachers$.subscribe((teachers) => {
        expect(teachers).toEqual(mockTeachers);
      });
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      mockRouter.url = '/sessions/create';
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should validate required fields', () => {
      Object.keys(component.sessionForm?.controls || {}).forEach((key) => {
        const control = component.sessionForm?.get(key);
        control?.markAsTouched();
        control?.updateValueAndValidity();
      });

      const form = component.sessionForm;
      expect(form?.get('name')?.hasError('required')).toBeTruthy();
      expect(form?.get('date')?.hasError('required')).toBeTruthy();
      expect(form?.get('teacher_id')?.hasError('required')).toBeTruthy();
      expect(form?.get('description')?.hasError('required')).toBeTruthy();
    });

    it('should validate description length', () => {
      const descriptionControl = component.sessionForm?.get('description');
      descriptionControl?.setValue('a'.repeat(2001));
      expect(descriptionControl?.errors?.['maxlength']).toBeTruthy();

      descriptionControl?.setValue('Valid description');
      expect(descriptionControl?.errors).toBeNull();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      mockRouter.url = '/sessions/create';
      component.ngOnInit();
      fixture.detectChanges();

      component.sessionForm?.patchValue({
        name: 'New Session',
        date: '2024-03-20',
        teacher_id: 1,
        description: 'Test Description',
      });
    });

    it('should create new session', () => {
      mockSessionApiService.create.mockReturnValue(of(mockSession));

      component.submit();

      expect(mockSessionApiService.create).toHaveBeenCalled();
      expect(mockMatSnackBar.open).toHaveBeenCalledWith(
        'Session created !',
        'Close',
        { duration: 3000 }
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
    });

    it('should update existing session', () => {
      mockRouter.url = '/sessions/update/1';
      component.ngOnInit();
      mockSessionApiService.update.mockReturnValue(of(mockSession));

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

  describe('Template Rendering', () => {
    beforeEach(() => {
      mockRouter.url = '/sessions/create';
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should display correct title for create mode', () => {
      const title = fixture.debugElement.query(By.css('h1'));
      expect(title.nativeElement.textContent.trim()).toBe('Create session');
    });

    it('should display correct title for update mode', () => {
      mockRouter.url = '/sessions/update/1';
      mockSessionApiService.detail.mockReturnValue(of(mockSession));
      component.ngOnInit();
      fixture.detectChanges();

      const title = fixture.debugElement.query(By.css('h1'));
      expect(title.nativeElement.textContent.trim()).toBe('Update session');
    });

    it('should render all form fields', () => {
      const formFields = fixture.debugElement.queryAll(
        By.css('mat-form-field')
      );
      expect(formFields.length).toBe(4); // name, date, teacher, description
    });

    it('should populate teacher select options', () => {
      const teacherSelect = fixture.debugElement.query(By.css('mat-select'));
      expect(teacherSelect).toBeTruthy();
    });

    it('should disable submit button when form is invalid', () => {
      component.sessionForm?.reset();
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );
      expect(submitButton.nativeElement.disabled).toBeTruthy();
    });

    it('should enable submit button when form is valid', () => {
      component.sessionForm?.setValue({
        name: 'Test Session',
        date: '2024-03-20',
        teacher_id: 1,
        description: 'Test Description',
      });
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );
      expect(submitButton.nativeElement.disabled).toBeFalsy();
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      mockRouter.url = '/sessions/create';
      component.ngOnInit();
      fixture.detectChanges();

      component.sessionForm?.patchValue({
        name: 'Test Session',
        date: '2024-03-20',
        teacher_id: 1,
        description: 'Test Description',
      });
    });

    it('should handle create error', (done) => {
      const error = new Error('Create error');
      mockSessionApiService.create.mockReturnValue(throwError(() => error));

      component.submit();

      fixture.whenStable().then(() => {
        expect(mockRouter.navigate).not.toHaveBeenCalledWith(['sessions']);
        expect(mockMatSnackBar.open).not.toHaveBeenCalled();
        done();
      });
    });

    it('should handle update error', (done) => {
      mockRouter.url = '/sessions/update/1';
      mockSessionApiService.detail.mockReturnValue(of(mockSession));
      component.ngOnInit();

      const error = new Error('Update error');
      mockSessionApiService.update.mockReturnValue(throwError(() => error));

      component.submit();

      fixture.whenStable().then(() => {
        expect(mockRouter.navigate).not.toHaveBeenCalledWith(['sessions']);
        expect(mockMatSnackBar.open).not.toHaveBeenCalled();
        done();
      });
    });

    it('should handle session load error in update mode', (done) => {
      mockRouter.url = '/sessions/update/1';
      const error = new Error('Load error');
      mockSessionApiService.detail.mockReturnValue(throwError(() => error));

      component.ngOnInit();

      fixture.whenStable().then(() => {
        expect(component.sessionForm).toBeDefined();
        expect(mockRouter.navigate).not.toHaveBeenCalledWith(['sessions']);
        done();
      });
    });
  });
});
