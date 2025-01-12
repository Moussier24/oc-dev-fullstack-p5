import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let sessionService: SessionService;
  let router: Router;

  const mockSessionInfo: SessionInformation = {
    token: 'fake-token',
    type: 'Bearer',
    id: 1,
    username: 'testUser',
    firstName: 'John',
    lastName: 'Doe',
    admin: false,
  };

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockSessionService = {
    logIn: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);

    jest.clearAllMocks();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize with empty form', () => {
      expect(component.form.get('email')?.value).toBe('');
      expect(component.form.get('password')?.value).toBe('');
    });

    it('should have password hidden by default', () => {
      expect(component.hide).toBeTruthy();
    });

    it('should start with no errors', () => {
      expect(component.onError).toBeFalsy();
    });
  });

  describe('Form Validation', () => {
    it('should validate email format', () => {
      const emailControl = component.form.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.errors?.['email']).toBeTruthy();

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.errors).toBeNull();
    });

    it('should require password with minimum length', () => {
      const passwordControl = component.form.get('password');
      passwordControl?.setValue('12');
      expect(passwordControl?.errors?.['minlength']).toBeTruthy();

      passwordControl?.setValue('123');
      expect(passwordControl?.errors).toBeNull();
    });

    it('should disable submit button when form is invalid', () => {
      const submitButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );
      expect(submitButton.nativeElement.disabled).toBeTruthy();
    });

    it('should enable submit button when form is valid', () => {
      component.form.setValue({
        email: 'test@test.com',
        password: '123',
      });
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );
      expect(submitButton.nativeElement.disabled).toBeFalsy();
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', () => {
      const toggleButton = fixture.debugElement.query(
        By.css('button[matSuffix]')
      );
      const passwordInput = fixture.debugElement.query(
        By.css('input[formControlName="password"]')
      );

      expect(passwordInput.nativeElement.type).toBe('password');

      toggleButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(passwordInput.nativeElement.type).toBe('text');

      toggleButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(passwordInput.nativeElement.type).toBe('password');
    });

    it('should update visibility icon', () => {
      const toggleButton = fixture.debugElement.query(
        By.css('button[matSuffix]')
      );
      const icon = toggleButton.query(By.css('mat-icon'));

      expect(icon.nativeElement.textContent).toBe('visibility_off');

      toggleButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(icon.nativeElement.textContent).toBe('visibility');
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.form.setValue({
        email: 'test@test.com',
        password: '123',
      });
    });

    it('should call auth service on submit', () => {
      mockAuthService.login.mockReturnValue(of(mockSessionInfo));

      component.submit();

      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: '123',
      });
    });

    it('should handle successful login', () => {
      mockAuthService.login.mockReturnValue(of(mockSessionInfo));

      component.submit();

      expect(mockSessionService.logIn).toHaveBeenCalledWith(mockSessionInfo);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    });

    it('should handle login error', () => {
      mockAuthService.login.mockReturnValue(throwError(() => new Error()));

      component.submit();

      expect(component.onError).toBeTruthy();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should display error message on failed login', () => {
      mockAuthService.login.mockReturnValue(throwError(() => new Error()));

      component.submit();
      fixture.detectChanges();

      const errorMessage = fixture.debugElement.query(By.css('.error'));
      expect(errorMessage.nativeElement.textContent).toContain(
        'An error occurred'
      );
    });
  });

  describe('Form Interaction', () => {
    it('should update form values on input', () => {
      const emailInput = fixture.debugElement.query(
        By.css('input[formControlName="email"]')
      );
      const passwordInput = fixture.debugElement.query(
        By.css('input[formControlName="password"]')
      );

      emailInput.nativeElement.value = 'test@test.com';
      emailInput.nativeElement.dispatchEvent(new Event('input'));
      passwordInput.nativeElement.value = '123';
      passwordInput.nativeElement.dispatchEvent(new Event('input'));

      expect(component.form.get('email')?.value).toBe('test@test.com');
      expect(component.form.get('password')?.value).toBe('123');
    });

    it('should submit form on valid submit button click', () => {
      mockAuthService.login.mockReturnValue(of(mockSessionInfo));
      component.form.setValue({
        email: 'test@test.com',
        password: '123',
      });
      fixture.detectChanges();

      const form = fixture.debugElement.query(By.css('form'));
      form.triggerEventHandler('submit', null);

      expect(mockAuthService.login).toHaveBeenCalled();
    });
  });
});
