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
import { of, throwError, Subscription } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { By } from '@angular/platform-browser';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService;
  let sessionService: SessionService;
  let router: Router;
  let matSnackBar: MatSnackBar;

  const mockAdminUser: User = {
    id: 1,
    email: 'admin@test.com',
    lastName: 'Admin',
    firstName: 'Super',
    password: 'password123',
    admin: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  const mockRegularUser: User = {
    id: 2,
    email: 'john.doe@test.com',
    lastName: 'Doe',
    firstName: 'John',
    password: 'password123',
    admin: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 2,
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

    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch user details on init', () => {
      mockUserService.getById.mockReturnValue(of(mockRegularUser));

      component.ngOnInit();

      expect(mockUserService.getById).toHaveBeenCalledWith('2');
      expect(component.user).toEqual(mockRegularUser);
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

      expect(mockUserService.delete).toHaveBeenCalledWith('2');
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

      expect(mockUserService.delete).toHaveBeenCalledWith('2');
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
      mockUserService.getById.mockReturnValue(of(mockRegularUser));

      component.ngOnInit();

      expect(component.user).toBeDefined();
      expect(component.user).toEqual(mockRegularUser);
    });
  });

  describe('Template rendering', () => {
    it('should display user information when user data is loaded', () => {
      mockUserService.getById.mockReturnValue(of(mockRegularUser));
      component.ngOnInit();
      fixture.detectChanges();

      const nameElement = fixture.debugElement.query(By.css('p')).nativeElement;
      expect(nameElement.textContent).toContain('Name: John DOE');

      const emailElement = fixture.debugElement.queryAll(By.css('p'))[1]
        .nativeElement;
      expect(emailElement.textContent).toContain('Email: john.doe@test.com');
    });

    it('should display admin message for admin users', () => {
      mockUserService.getById.mockReturnValue(of(mockAdminUser));
      component.ngOnInit();
      fixture.detectChanges();

      const adminMessage = fixture.debugElement.query(By.css('.my2'));
      expect(adminMessage.nativeElement.textContent).toContain('You are admin');
    });

    it('should display delete button only for non-admin users', () => {
      mockUserService.getById.mockReturnValue(of(mockRegularUser));
      component.ngOnInit();
      fixture.detectChanges();

      const deleteButton = fixture.debugElement.query(
        By.css('button[mat-raised-button]')
      );
      expect(deleteButton).toBeTruthy();
      expect(
        deleteButton.nativeElement.querySelector('span.ml1').textContent
      ).toContain('Detail');
    });

    it('should not display delete button for admin users', () => {
      mockUserService.getById.mockReturnValue(of(mockAdminUser));
      component.ngOnInit();
      fixture.detectChanges();

      const deleteButton = fixture.debugElement.query(
        By.css('button[mat-raised-button]')
      );
      expect(deleteButton).toBeFalsy();
    });

    it('should display formatted dates', () => {
      mockUserService.getById.mockReturnValue(of(mockRegularUser));
      component.ngOnInit();
      fixture.detectChanges();

      const dateElements = fixture.debugElement.queryAll(By.css('.w100 p'));
      expect(dateElements[0].nativeElement.textContent).toContain(
        'January 1, 2024'
      );
      expect(dateElements[1].nativeElement.textContent).toContain(
        'January 2, 2024'
      );
    });

    it('should have working back button', () => {
      const backButton = fixture.debugElement.query(
        By.css('button[mat-icon-button]')
      );
      const mockHistoryBack = jest.spyOn(window.history, 'back');

      expect(backButton).toBeTruthy();
      expect(
        backButton.nativeElement.querySelector('mat-icon').textContent
      ).toContain('arrow_back');

      backButton.nativeElement.click();
      expect(mockHistoryBack).toHaveBeenCalled();
    });

    it('should not display user information when user is undefined', () => {
      jest.clearAllMocks();
      mockUserService.getById.mockReturnValue(of(undefined));

      component.user = undefined;
      fixture.detectChanges();

      const userInfo = fixture.debugElement.query(
        By.css('div[fxLayout="column"][fxLayoutAlign="start center"]')
      );
      expect(userInfo).toBeFalsy();
    });

    it('should handle delete button click', () => {
      mockUserService.getById.mockReturnValue(of(mockRegularUser));
      mockUserService.delete.mockReturnValue(of(undefined));
      component.ngOnInit();
      fixture.detectChanges();

      const deleteButton = fixture.debugElement.query(
        By.css('button[mat-raised-button]')
      );
      deleteButton.nativeElement.click();

      expect(mockUserService.delete).toHaveBeenCalledWith('2');
      expect(mockMatSnackBar.open).toHaveBeenCalledWith(
        'Your account has been deleted !',
        'Close',
        { duration: 3000 }
      );
      expect(mockSessionService.logOut).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('Error handling', () => {
    it('should handle error when fetching user details', () => {
      const error = new Error('Failed to fetch user');
      mockUserService.getById.mockReturnValue(throwError(() => error));

      component.ngOnInit();

      expect(component.user).toBeUndefined();
      expect(mockMatSnackBar.open).toHaveBeenCalledWith(
        'Error loading user details',
        'Close',
        { duration: 3000 }
      );
    });

    it('should handle error when deleting account', () => {
      const error = new Error('Failed to delete account');
      mockUserService.delete.mockReturnValue(throwError(() => error));

      component.delete();

      expect(mockMatSnackBar.open).toHaveBeenCalledWith(
        'Error deleting account',
        'Close',
        { duration: 3000 }
      );
      expect(mockSessionService.logOut).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Component lifecycle', () => {
    it('should clean up subscriptions on destroy', () => {
      const subscription = new Subscription();
      const unsubscribeSpy = jest.spyOn(subscription, 'unsubscribe');
      (component as any).subscription = subscription;

      component.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});
