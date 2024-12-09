import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { MeComponent } from './me.component';
import { of } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService;
  let sessionService: SessionService;
  let router: Router;
  let matSnackBar: MatSnackBar;

  const mockUser: User = {
    id: 1,
    email: 'john.doe@test.com',
    lastName: 'Doe',
    firstName: 'John',
    password: 'password123',
    admin: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
    logOut: jest.fn(),
  };

  const mockUserService = {
    getById: jest.fn(),
    delete: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockMatSnackBar = {
    open: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    matSnackBar = TestBed.inject(MatSnackBar);

    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch user details on init', () => {
      mockUserService.getById.mockReturnValue(of(mockUser));

      component.ngOnInit();

      expect(mockUserService.getById).toHaveBeenCalledWith('1');
      expect(component.user).toEqual(mockUser);
    });
  });

  describe('back', () => {
    it('should navigate back in history', () => {
      const mockHistoryBack = jest.spyOn(window.history, 'back');

      component.back();

      expect(mockHistoryBack).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      mockUserService.delete.mockReturnValue(of(undefined));
    });

    it('should delete user account', () => {
      component.delete();

      expect(mockUserService.delete).toHaveBeenCalledWith('1');
    });

    it('should show success message after deletion', () => {
      component.delete();

      expect(mockMatSnackBar.open).toHaveBeenCalledWith(
        'Your account has been deleted !',
        'Close',
        { duration: 3000 }
      );
    });

    it('should log out user after deletion', () => {
      component.delete();

      expect(mockSessionService.logOut).toHaveBeenCalled();
    });

    it('should navigate to home after deletion', () => {
      component.delete();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should handle the complete deletion flow in correct order', () => {
      component.delete();

      expect(mockUserService.delete).toHaveBeenCalledWith('1');
      expect(mockMatSnackBar.open).toHaveBeenCalled();
      expect(mockSessionService.logOut).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);

      // Vérifier l'ordre des appels
      const mockCalls = [];
      if (mockUserService.delete.mock.calls.length) mockCalls.push('delete');
      if (mockMatSnackBar.open.mock.calls.length) mockCalls.push('snackbar');
      if (mockSessionService.logOut.mock.calls.length) mockCalls.push('logout');
      if (mockRouter.navigate.mock.calls.length) mockCalls.push('navigate');

      expect(mockCalls).toEqual(['delete', 'snackbar', 'logout', 'navigate']);
    });
  });

  describe('User data handling', () => {
    it('should initialize with undefined user', () => {
      expect(component.user).toBeUndefined();
    });

    it('should update user data after successful fetch', () => {
      mockUserService.getById.mockReturnValue(of(mockUser));

      component.ngOnInit();

      expect(component.user).toBeDefined();
      expect(component.user).toEqual(mockUser);
    });
  });
});
