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
      admin: true,
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
    teacher_id: 1,
    users: [1],
    name: 'Test Session',
    description: 'This is a test session',
    date: new Date(),
  };

  const mockTeacher: Teacher = {
    id: 1,
    lastName: 'Teacher',
    firstName: 'Test',
    updatedAt: new Date(),
    createdAt: new Date(),
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
        get: () => '1',
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

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch session details on init', () => {
    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    mockTeacherService.detail.mockReturnValue(of(mockTeacher));

    component.ngOnInit();

    expect(mockSessionApiService.detail).toHaveBeenCalledWith(
      component.sessionId
    );
    expect(mockTeacherService.detail).toHaveBeenCalledWith(
      mockSession.teacher_id.toString()
    );
    expect(component.session).toEqual(mockSession);
    expect(component.teacher).toEqual(mockTeacher);
    expect(component.isParticipate).toBe(true);
  });

  it('should call delete and navigate on success', (done) => {
    const mockSessionId = '1';
    component.sessionId = mockSessionId;
    mockSessionApiService.delete.mockReturnValue(of(null));

    component.delete();

    setTimeout(() => {
      expect(mockSessionApiService.delete).toHaveBeenCalledWith(mockSessionId);
      expect(mockMatSnackBar.open).toHaveBeenCalledWith(
        'Session deleted !',
        'Close',
        { duration: 3000 }
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
      done();
    });
  });

  it('should participate and refresh session', (done) => {
    const mockUserId = '1';
    component.userId = mockUserId;
    mockSessionApiService.participate.mockReturnValue(of(null));
    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    mockTeacherService.detail.mockReturnValue(of(mockTeacher));

    component.participate();

    setTimeout(() => {
      expect(mockSessionApiService.participate).toHaveBeenCalledWith(
        component.sessionId,
        mockUserId
      );
      expect(mockSessionApiService.detail).toHaveBeenCalled();
      expect(mockTeacherService.detail).toHaveBeenCalled();
      expect(component.session).toEqual(mockSession);
      expect(component.teacher).toEqual(mockTeacher);
      done();
    });
  });

  it('should unparticipate and refresh session', (done) => {
    const mockUserId = '1';
    component.userId = mockUserId;
    mockSessionApiService.unParticipate.mockReturnValue(of(null));
    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    mockTeacherService.detail.mockReturnValue(of(mockTeacher));

    component.unParticipate();

    setTimeout(() => {
      expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith(
        component.sessionId,
        mockUserId
      );
      expect(mockSessionApiService.detail).toHaveBeenCalled();
      expect(mockTeacherService.detail).toHaveBeenCalled();
      expect(component.session).toEqual(mockSession);
      expect(component.teacher).toEqual(mockTeacher);
      done();
    });
  });

  it('should fetch teacher details', () => {
    component.session = mockSession;
    mockTeacherService.detail.mockReturnValue(of(mockTeacher));

    component.ngOnInit();

    expect(mockTeacherService.detail).toHaveBeenCalledWith(
      mockSession.teacher_id.toString()
    );
    expect(component.teacher).toEqual(mockTeacher);
  });
});
