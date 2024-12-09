import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { AuthGuard } from './auth.guard';
import { SessionService } from '../services/session.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;
  let sessionService: SessionService;

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockSessionService = {
    isLogged: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: mockRouter },
        { provide: SessionService, useValue: mockSessionService },
      ],
    });
    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);

    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should allow access when user is logged in', () => {
      mockSessionService.isLogged = true;

      const result = guard.canActivate();

      expect(result).toBeTruthy();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to login when user is not logged in', () => {
      mockSessionService.isLogged = false;

      const result = guard.canActivate();

      expect(result).toBeFalsy();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
    });
  });
});
