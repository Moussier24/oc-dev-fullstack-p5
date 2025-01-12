import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { AuthService } from '../../services/auth.service';
import { RegisterComponent } from './register.component';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  const mockAuthService = {
    register: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
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
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
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
      expect(component.form.get('firstName')?.value).toBe('');
      expect(component.form.get('lastName')?.value).toBe('');
      expect(component.form.get('password')?.value).toBe('');
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

    it('should validate firstName length', () => {
      const firstNameControl = component.form.get('firstName');

      firstNameControl?.setValue('ab');
      expect(firstNameControl?.errors?.['minlength']).toBeTruthy();

      firstNameControl?.setValue('a'.repeat(21));
      expect(firstNameControl?.errors?.['maxlength']).toBeTruthy();

      firstNameControl?.setValue('John');
      expect(firstNameControl?.errors).toBeNull();
    });

    it('should validate lastName length', () => {
      const lastNameControl = component.form.get('lastName');

      lastNameControl?.setValue('ab');
      expect(lastNameControl?.errors?.['minlength']).toBeTruthy();

      lastNameControl?.setValue('a'.repeat(21));
      expect(lastNameControl?.errors?.['maxlength']).toBeTruthy();

      lastNameControl?.setValue('Doe');
      expect(lastNameControl?.errors).toBeNull();
    });

    it('should validate password length', () => {
      const passwordControl = component.form.get('password');

      passwordControl?.setValue('ab');
      expect(passwordControl?.errors?.['minlength']).toBeTruthy();

      passwordControl?.setValue('a'.repeat(41));
      expect(passwordControl?.errors?.['maxlength']).toBeTruthy();

      passwordControl?.setValue('password123');
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
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      });
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );
      expect(submitButton.nativeElement.disabled).toBeFalsy();
    });
  });

  describe('Form Submission', () => {
    const validForm = {
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    };

    beforeEach(() => {
      component.form.setValue(validForm);
    });

    it('should call auth service on submit', () => {
      mockAuthService.register.mockReturnValue(of(undefined));

      component.submit();

      expect(mockAuthService.register).toHaveBeenCalledWith(validForm);
    });

    it('should navigate to login on successful registration', () => {
      mockAuthService.register.mockReturnValue(of(undefined));

      component.submit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle registration error', () => {
      mockAuthService.register.mockReturnValue(throwError(() => new Error()));

      component.submit();

      expect(component.onError).toBeTruthy();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should display error message on failed registration', () => {
      mockAuthService.register.mockReturnValue(throwError(() => new Error()));

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
      const inputs = fixture.debugElement.queryAll(By.css('input'));

      // Test each input field
      const testValues = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        password: 'password123',
      };

      Object.keys(testValues).forEach((key, index) => {
        const input = inputs[index].nativeElement;
        input.value = testValues[key as keyof typeof testValues];
        input.dispatchEvent(new Event('input'));
      });

      expect(component.form.value).toEqual(testValues);
    });

    it('should submit form on valid submit button click', () => {
      mockAuthService.register.mockReturnValue(of(undefined));
      component.form.setValue({
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      });
      fixture.detectChanges();

      const form = fixture.debugElement.query(By.css('form'));
      form.triggerEventHandler('submit', null);

      expect(mockAuthService.register).toHaveBeenCalled();
    });
  });
});
