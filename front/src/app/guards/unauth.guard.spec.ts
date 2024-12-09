import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { UnauthGuard } from './unauth.guard';
import { SessionService } from '../services/session.service';

describe('UnauthGuard', () => {
  let guard: UnauthGuard;
  let router: Router;
  let sessionService: SessionService;

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockSessionService = {
    isLogged: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UnauthGuard,
        { provide: Router, useValue: mockRouter },
        { provide: SessionService, useValue: mockSessionService },
      ],
    });
    guard = TestBed.inject(UnauthGuard);
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);

    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should allow access when user is not logged in', () => {
      mockSessionService.isLogged = false;

      const result = guard.canActivate();

      expect(result).toBeTruthy();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to rentals when user is logged in', () => {
      mockSessionService.isLogged = true;

      const result = guard.canActivate();

      expect(result).toBeFalsy();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['rentals']);
    });
  });
});
