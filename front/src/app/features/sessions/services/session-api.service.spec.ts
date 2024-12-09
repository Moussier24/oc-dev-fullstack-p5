import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';
import { of } from 'rxjs';

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpClient: HttpClient;

  const mockSession: Session = {
    id: 1,
    name: 'Session test',
    description: 'Description test',
    date: new Date(),
    teacher_id: 1,
    users: [1, 2],
  };

  const mockSessions: Session[] = [
    mockSession,
    {
      id: 2,
      name: 'Session test 2',
      description: 'Description test 2',
      date: new Date(),
      teacher_id: 2,
      users: [3, 4],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        {
          provide: HttpClient,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    });
    service = TestBed.inject(SessionApiService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('all', () => {
    it('should call http GET to fetch all sessions', () => {
      jest.spyOn(httpClient, 'get').mockReturnValue(of(mockSessions));

      service.all().subscribe((sessions) => {
        expect(sessions).toEqual(mockSessions);
        expect(sessions.length).toBe(2);
      });

      expect(httpClient.get).toHaveBeenCalledWith('api/session');
    });
  });

  describe('detail', () => {
    it('should call http GET to fetch session details', () => {
      jest.spyOn(httpClient, 'get').mockReturnValue(of(mockSession));
      const sessionId = '1';

      service.detail(sessionId).subscribe((session) => {
        expect(session).toEqual(mockSession);
      });

      expect(httpClient.get).toHaveBeenCalledWith(`api/session/${sessionId}`);
    });
  });

  describe('delete', () => {
    it('should call http DELETE to remove a session', () => {
      jest.spyOn(httpClient, 'delete').mockReturnValue(of({}));
      const sessionId = '1';

      service.delete(sessionId).subscribe();

      expect(httpClient.delete).toHaveBeenCalledWith(
        `api/session/${sessionId}`
      );
    });
  });

  describe('create', () => {
    it('should call http POST to create a session', () => {
      jest.spyOn(httpClient, 'post').mockReturnValue(of(mockSession));
      const newSession: Session = {
        name: 'New Session',
        description: 'New Description',
        date: new Date(),
        teacher_id: 1,
        users: [],
      } as Session;

      service.create(newSession).subscribe((session) => {
        expect(session).toEqual(mockSession);
      });

      expect(httpClient.post).toHaveBeenCalledWith('api/session', newSession);
    });
  });

  describe('update', () => {
    it('should call http PUT to update a session', () => {
      jest.spyOn(httpClient, 'put').mockReturnValue(of(mockSession));
      const sessionId = '1';
      const updatedSession: Session = {
        ...mockSession,
        name: 'Updated Session',
      };

      service.update(sessionId, updatedSession).subscribe((session) => {
        expect(session).toEqual(mockSession);
      });

      expect(httpClient.put).toHaveBeenCalledWith(
        `api/session/${sessionId}`,
        updatedSession
      );
    });
  });

  describe('participate', () => {
    it('should call http POST to participate in a session', () => {
      jest.spyOn(httpClient, 'post').mockReturnValue(of(undefined));
      const sessionId = '1';
      const userId = '1';

      service.participate(sessionId, userId).subscribe();

      expect(httpClient.post).toHaveBeenCalledWith(
        `api/session/${sessionId}/participate/${userId}`,
        null
      );
    });
  });

  describe('unParticipate', () => {
    it('should call http DELETE to remove participation from a session', () => {
      jest.spyOn(httpClient, 'delete').mockReturnValue(of(undefined));
      const sessionId = '1';
      const userId = '1';

      service.unParticipate(sessionId, userId).subscribe();

      expect(httpClient.delete).toHaveBeenCalledWith(
        `api/session/${sessionId}/participate/${userId}`
      );
    });
  });
});
