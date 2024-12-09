import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { RegisterComponent } from './register.component';
import { By } from '@angular/platform-browser';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockReturnValue(of(null)),
          },
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('firstName')?.value).toBe('');
    expect(component.form.get('lastName')?.value).toBe('');
    expect(component.form.get('password')?.value).toBe('');
  });

  it('should have invalid form when fields are empty', () => {
    expect(component.form.valid).toBeFalsy();

    const emailErrors = component.form.get('email')?.errors;
    const firstNameErrors = component.form.get('firstName')?.errors;
    const lastNameErrors = component.form.get('lastName')?.errors;
    const passwordErrors = component.form.get('password')?.errors;

    expect(emailErrors?.['required']).toBeTruthy();
    expect(firstNameErrors?.['required']).toBeTruthy();
    expect(lastNameErrors?.['required']).toBeTruthy();
    expect(passwordErrors?.['required']).toBeTruthy();

    const submitButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    );
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it('should call register service and navigate to /login on successful registration', (done) => {
    const mockRegisterRequest = {
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    };

    component.form.patchValue(mockRegisterRequest);
    component.submit();

    setTimeout(() => {
      expect(authService.register).toHaveBeenCalledWith(mockRegisterRequest);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(component.onError).toBeFalsy();
      done();
    });
  });

  it('should handle registration error correctly', (done) => {
    const mockRegisterRequest = {
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    };

    (authService.register as jest.Mock).mockReturnValue(
      throwError(() => new Error('Registration failed'))
    );

    component.form.patchValue(mockRegisterRequest);
    component.submit();

    setTimeout(() => {
      expect(component.onError).toBeTruthy();
      expect(router.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should validate email format', () => {
    const emailControl = component.form.get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors).toBeFalsy();
  });

  it('should validate firstName length constraints', () => {
    const firstNameControl = component.form.get('firstName');

    firstNameControl?.setValue('Jo'); // Trop court
    expect(firstNameControl?.errors?.['minlength']).toBeTruthy();

    firstNameControl?.setValue('ThisIsAVeryLongFirstNameThatExceedsLimit'); // Trop long
    expect(firstNameControl?.errors?.['maxlength']).toBeTruthy();

    firstNameControl?.setValue('John'); // Correct
    expect(firstNameControl?.errors).toBeFalsy();
  });

  it('should validate lastName length constraints', () => {
    const lastNameControl = component.form.get('lastName');

    lastNameControl?.setValue('Do'); // Trop court
    expect(lastNameControl?.errors?.['minlength']).toBeTruthy();

    lastNameControl?.setValue('ThisIsAVeryLongLastNameThatExceedsLimit'); // Trop long
    expect(lastNameControl?.errors?.['maxlength']).toBeTruthy();

    lastNameControl?.setValue('Doe'); // Correct
    expect(lastNameControl?.errors).toBeFalsy();
  });

  it('should validate password length constraints', () => {
    const passwordControl = component.form.get('password');

    passwordControl?.setValue('12'); // Trop court
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();

    passwordControl?.setValue(
      'ThisIsAVeryLongPasswordThatExceedsTheMaximumLimit'
    ); // Trop long
    expect(passwordControl?.errors?.['maxlength']).toBeTruthy();

    passwordControl?.setValue('password123'); // Correct
    expect(passwordControl?.errors).toBeFalsy();
  });
});
