import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { AuthService } from '../../services/auth.service';

import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let sessionService: SessionService;
  let authService: AuthService;
  let router: Router;

  const mockSessionInfo: SessionInformation = {
    token: 'fake-token',
    type: 'Bearer',
    id: 1,
    username: 'test@test.com',
    firstName: 'Test',
    lastName: 'User',
    admin: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        {
          provide: SessionService,
          useValue: {
            logIn: jest.fn(),
            $isLogged: of(false),
          },
        },
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockReturnValue(of(null)),
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
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('password')?.value).toBe('');
  });

  it('should have invalid form when fields are empty', () => {
    // Vérifie que le formulaire est invalide
    expect(component.form.valid).toBeFalsy();

    // Vérifie les erreurs de validation
    const emailErrors = component.form.get('email')?.errors;
    const passwordErrors = component.form.get('password')?.errors;
    expect(emailErrors?.['required']).toBeTruthy();
    expect(passwordErrors?.['required']).toBeTruthy();

    // Vérifie que le bouton submit est désactivé dans le template
    const submitButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    );
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it('should call login service and navigate to /sessions on successful login', (done) => {
    const mockCredentials = {
      email: 'test@test.com',
      password: 'password123',
    };

    // Mock du service d'authentification qui retourne un Observable
    (authService.login as jest.Mock).mockReturnValue(of(mockSessionInfo));

    component.form.patchValue(mockCredentials);
    component.submit();

    // On utilise setTimeout pour laisser le temps à l'Observable de se résoudre
    setTimeout(() => {
      expect(authService.login).toHaveBeenCalledWith(mockCredentials);
      expect(sessionService.logIn).toHaveBeenCalledWith(mockSessionInfo);
      expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
      done();
    });
  });

  it('should handle login error correctly', (done) => {
    const mockCredentials = {
      email: 'test@test.com',
      password: 'password123',
    };

    // Mock du service d'authentification qui retourne un Observable d'erreur
    (authService.login as jest.Mock).mockReturnValue(
      throwError(() => new Error('Login failed'))
    );

    component.form.patchValue(mockCredentials);
    component.submit();

    // On utilise setTimeout pour laisser le temps �� l'Observable de se résoudre
    setTimeout(() => {
      expect(component.onError).toBe(true);
      expect(sessionService.logIn).not.toHaveBeenCalled();
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

  it('should validate password minimum length', () => {
    const passwordControl = component.form.get('password');

    // Test avec un mot de passe trop court
    passwordControl?.setValue('12');
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();

    // Test avec un mot de passe valide
    passwordControl?.setValue('password123');
    expect(passwordControl?.errors).toBeFalsy();
  });
});
