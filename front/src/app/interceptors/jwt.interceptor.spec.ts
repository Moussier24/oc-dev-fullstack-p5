import { TestBed } from '@angular/core/testing';
import { HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { SessionService } from '../services/session.service';
import { expect } from '@jest/globals';
import { SessionInformation } from '../interfaces/sessionInformation.interface';
import { Observable, of } from 'rxjs';

describe('JwtInterceptor', () => {
  let interceptor: JwtInterceptor;
  let sessionService: SessionService;
  let httpHandler: HttpHandler;

  const mockSessionInformation: SessionInformation = {
    id: 1,
    username: 'testUser',
    firstName: 'Test',
    lastName: 'User',
    admin: true,
    token: 'fake-jwt-token',
    type: 'Bearer',
  };

  const mockSessionService = {
    sessionInformation: mockSessionInformation,
    isLogged: true,
  };

  const mockHttpHandler = {
    handle: jest.fn().mockReturnValue(of({})),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JwtInterceptor,
        { provide: SessionService, useValue: mockSessionService },
        { provide: HttpHandler, useValue: mockHttpHandler },
      ],
    });

    interceptor = TestBed.inject(JwtInterceptor);
    sessionService = TestBed.inject(SessionService);
    httpHandler = TestBed.inject(HttpHandler);

    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
    mockSessionService.isLogged = true;
    mockSessionService.sessionInformation = { ...mockSessionInformation };
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('intercept', () => {
    it('should add Authorization header when user is logged in', () => {
      const request = new HttpRequest('GET', '/api/test', null);

      interceptor.intercept(request, httpHandler);

      const modifiedRequest = mockHttpHandler.handle.mock.calls[0][0];
      expect(modifiedRequest.headers.get('Authorization')).toBe(
        `Bearer ${mockSessionInformation.token}`
      );
    });

    it('should not add Authorization header when user is not logged in', () => {
      const request = new HttpRequest('GET', '/api/test', null);
      mockSessionService.isLogged = false;

      interceptor.intercept(request, httpHandler);

      const modifiedRequest = mockHttpHandler.handle.mock.calls[0][0];
      expect(modifiedRequest.headers.has('Authorization')).toBeFalsy();
    });

    it('should not modify original request', () => {
      const originalRequest = new HttpRequest('GET', '/api/test', null);

      interceptor.intercept(originalRequest, httpHandler);

      expect(originalRequest.headers.has('Authorization')).toBeFalsy();
    });

    it('should handle requests with existing headers', () => {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      const request = new HttpRequest('GET', '/api/test', null, { headers });

      interceptor.intercept(request, httpHandler);

      const modifiedRequest = mockHttpHandler.handle.mock.calls[0][0];
      expect(modifiedRequest.headers.get('Content-Type')).toBe(
        'application/json'
      );
      expect(modifiedRequest.headers.get('Authorization')).toBe(
        `Bearer ${mockSessionInformation.token}`
      );
    });

    it('should forward the request to the next handler', () => {
      const request = new HttpRequest('GET', '/api/test', null);
      const expectedResponse = of({ data: 'test' });
      mockHttpHandler.handle.mockReturnValue(expectedResponse);

      const result = interceptor.intercept(request, httpHandler);

      expect(mockHttpHandler.handle).toHaveBeenCalled();
      expect(result).toBe(expectedResponse);
    });

    it('should handle missing token gracefully', () => {
      const request = new HttpRequest('GET', '/api/test', null);
      mockSessionService.sessionInformation = {
        ...mockSessionInformation,
        token: '',
      };

      interceptor.intercept(request, httpHandler);

      const modifiedRequest = mockHttpHandler.handle.mock.calls[0][0];
      expect(modifiedRequest.headers.get('Authorization')).toBe('Bearer ');
    });

    it('should preserve other request properties', () => {
      const body = { data: 'test' };
      const request = new HttpRequest('POST', '/api/test', body);

      interceptor.intercept(request, httpHandler);

      const modifiedRequest = mockHttpHandler.handle.mock.calls[0][0];
      expect(modifiedRequest.method).toBe('POST');
      expect(modifiedRequest.url).toBe('/api/test');
      expect(modifiedRequest.body).toEqual(body);
    });
  });
});
