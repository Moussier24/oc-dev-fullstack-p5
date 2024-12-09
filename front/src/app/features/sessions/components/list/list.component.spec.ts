import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { ListComponent } from './list.component';
import { of } from 'rxjs';
import { Session } from '../../interfaces/session.interface';
import { SessionInformation } from '../../../../interfaces/sessionInformation.interface';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;

  const mockSessions: Session[] = [
    {
      id: 1,
      name: 'Session 1',
      description: 'Description 1',
      date: new Date(),
      teacher_id: 1,
      users: [1, 2],
    },
    {
      id: 2,
      name: 'Session 2',
      description: 'Description 2',
      date: new Date(),
      teacher_id: 2,
      users: [3, 4],
    },
  ];

  const mockSessionInformation: SessionInformation = {
    id: 1,
    username: 'testUser',
    firstName: 'Test',
    lastName: 'User',
    admin: true,
    type: 'Bearer',
    token: 'fake-token',
  };

  const mockSessionService = {
    sessionInformation: mockSessionInformation as
      | SessionInformation
      | undefined,
  };

  const mockSessionApiService = {
    all: jest.fn().mockReturnValue(of(mockSessions)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        RouterModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);

    // S'assurer que sessionInformation est défini avant chaque test
    mockSessionService.sessionInformation = { ...mockSessionInformation };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all sessions on init', (done) => {
    expect(mockSessionApiService.all).toHaveBeenCalled();

    component.sessions$.subscribe((sessions) => {
      expect(sessions).toEqual(mockSessions);
      expect(sessions.length).toBe(2);
      done();
    });
  });

  it('should return user information from session service', () => {
    const user = component.user;
    expect(user).toBeDefined();
    expect(user).toEqual(mockSessionInformation);
  });

  it('should handle undefined session information', () => {
    (mockSessionService.sessionInformation as SessionInformation | undefined) =
      undefined;
    const user = component.user;
    expect(user).toBeUndefined();
  });

  describe('Sessions Observable', () => {
    beforeEach(() => {
      // Réinitialiser sessionInformation avant chaque test
      mockSessionService.sessionInformation = { ...mockSessionInformation };
      fixture.detectChanges();
    });

    it('should emit sessions data', (done) => {
      component.sessions$.subscribe((sessions) => {
        expect(sessions).toBeTruthy();
        expect(Array.isArray(sessions)).toBeTruthy();
        expect(sessions).toEqual(mockSessions);
        done();
      });
    });

    it('should contain correct session properties', (done) => {
      component.sessions$.subscribe((sessions) => {
        const firstSession = sessions[0];
        expect(firstSession).toHaveProperty('id');
        expect(firstSession).toHaveProperty('name');
        expect(firstSession).toHaveProperty('description');
        expect(firstSession).toHaveProperty('date');
        expect(firstSession).toHaveProperty('teacher_id');
        expect(firstSession).toHaveProperty('users');
        done();
      });
    });
  });
});
