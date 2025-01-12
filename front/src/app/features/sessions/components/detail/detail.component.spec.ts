import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { DetailComponent } from './detail.component';
import { of, throwError } from 'rxjs';
import { TeacherService } from '../../../../services/teacher.service';
import { Teacher } from '../../../../interfaces/teacher.interface';
import { Session } from '../../interfaces/session.interface';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Routes } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';

const routes: Routes = [{ path: 'sessions', component: DetailComponent }];

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;
  let router: Router;
  let matSnackBar: MatSnackBar;

  const mockSessionService = {
    sessionInformation: {
      admin: false,
      id: 1,
    },
  };

  const mockSessionApiService = {
    detail: jest.fn(),
    delete: jest.fn(),
    participate: jest.fn(),
    unParticipate: jest.fn(),
  };

  const mockTeacherService = {
    detail: jest.fn(),
  };

  const mockSession: Session = {
    id: 1,
    name: 'Session Test',
    description: 'Description test',
    date: new Date('2024-01-01'),
    teacher_id: 1,
    users: [1, 2],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  const mockTeacher: Teacher = {
    id: 1,
    lastName: 'Doe',
    firstName: 'John',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockMatSnackBar = {
    open: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
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
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        ReactiveFormsModule,
      ],
      declarations: [DetailComponent],
      providers: [
        FormBuilder,
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);
    router = TestBed.inject(Router);
    matSnackBar = TestBed.inject(MatSnackBar);

    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    mockTeacherService.detail.mockReturnValue(of(mockTeacher));

    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should fetch session and teacher details on init', () => {
      component.ngOnInit();

      expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
      expect(mockTeacherService.detail).toHaveBeenCalledWith('1');
      expect(component.session).toEqual(mockSession);
      expect(component.teacher).toEqual(mockTeacher);
    });

    it('should set participation status correctly', () => {
      component.ngOnInit();
      expect(component.isParticipate).toBeTruthy();
    });

    it('should set admin status from session service', () => {
      expect(component.isAdmin).toBe(
        mockSessionService.sessionInformation.admin
      );
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should display session name', () => {
      const title = fixture.debugElement.query(By.css('h1'));
      expect(title.nativeElement.textContent).toContain('Session Test');
    });

    it('should display teacher name', () => {
      const teacherInfo = fixture.debugElement.query(
        By.css('mat-card-subtitle')
      );
      expect(teacherInfo.nativeElement.textContent).toContain('John DOE');
    });

    it('should show delete button for admin users', () => {
      mockSessionService.sessionInformation.admin = true;
      fixture.detectChanges();

      const deleteButton = fixture.debugElement.query(
        By.css('button[color="warn"]')
      );
      expect(deleteButton).toBeTruthy();
    });

    it('should show participate button for non-participants', () => {
      component.isParticipate = false;
      component.isAdmin = false;
      fixture.detectChanges();

      const participateButton = fixture.debugElement.query(
        By.css('button[mat-raised-button][color="primary"]')
      );
      expect(participateButton).toBeTruthy();
      expect(participateButton.nativeElement.textContent.trim()).toContain(
        'Participate'
      );
    });

    it('should show unparticipate button for participants', () => {
      component.isParticipate = true;
      component.isAdmin = false;
      fixture.detectChanges();

      const unparticipateButton = fixture.debugElement.query(
        By.css('div:not(.admin) button[mat-raised-button][color="warn"]')
      );
      expect(unparticipateButton).toBeTruthy();
      expect(unparticipateButton.nativeElement.textContent.trim()).toContain(
        'Do not participate'
      );
    });

    it('should display session details correctly', () => {
      const attendees = fixture.debugElement.query(
        By.css('div.my2 span:nth-child(2)')
      );
      expect(attendees.nativeElement.textContent).toContain('2 attendees');

      const description = fixture.debugElement.query(By.css('.description'));
      expect(description.nativeElement.textContent).toContain(
        'Description test'
      );
    });

    it('should display dates correctly', () => {
      const createdDate = fixture.debugElement.query(By.css('.created'));
      const updatedDate = fixture.debugElement.query(By.css('.updated'));

      expect(createdDate.nativeElement.textContent).toContain(
        'January 1, 2024'
      );
      expect(updatedDate.nativeElement.textContent).toContain(
        'January 2, 2024'
      );
    });

    it('should display correct number of attendees', () => {
      const attendeesElement = fixture.debugElement.query(
        By.css('div.my2 span:nth-child(2)')
      );
      expect(attendeesElement.nativeElement.textContent.trim()).toBe(
        '2 attendees'
      );
    });

    it('should display session description', () => {
      const descriptionElement = fixture.debugElement.query(
        By.css('.description')
      );
      const descriptionText =
        descriptionElement.nativeElement.textContent.trim();
      expect(descriptionText).toContain('Description test');
    });
  });

  describe('User Actions', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should handle back navigation', () => {
      const historyBackSpy = jest.spyOn(window.history, 'back');
      const backButton = fixture.debugElement.query(
        By.css('button[mat-icon-button]')
      );

      backButton.triggerEventHandler('click', null);

      expect(historyBackSpy).toHaveBeenCalled();
    });

    it('should handle session deletion', () => {
      mockSessionApiService.delete.mockReturnValue(of(undefined));

      component.delete();

      expect(mockSessionApiService.delete).toHaveBeenCalledWith('1');
      expect(mockMatSnackBar.open).toHaveBeenCalledWith(
        'Session deleted !',
        'Close',
        { duration: 3000 }
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
    });

    it('should handle participation', () => {
      mockSessionApiService.participate.mockReturnValue(of(undefined));

      component.participate();

      expect(mockSessionApiService.participate).toHaveBeenCalledWith('1', '1');
      expect(mockSessionApiService.detail).toHaveBeenCalled();
    });

    it('should handle unparticipation', () => {
      mockSessionApiService.unParticipate.mockReturnValue(of(undefined));

      component.unParticipate();

      expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith(
        '1',
        '1'
      );
      expect(mockSessionApiService.detail).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle session fetch error', () => {
      mockSessionApiService.detail.mockReturnValue(
        throwError(() => new Error('Fetch error'))
      );

      component.ngOnInit();

      expect(component.session).toBeUndefined();
      expect(component.teacher).toBeUndefined();
    });

    it('should handle deletion error gracefully', () => {
      mockSessionApiService.delete.mockReturnValue(
        throwError(() => new Error('Delete error'))
      );

      component.delete();

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });
});
