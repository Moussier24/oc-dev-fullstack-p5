import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  const mockSessionInformation: SessionInformation = {
    id: 1,
    username: 'testUser',
    firstName: 'Test',
    lastName: 'User',
    admin: true,
    type: 'Bearer',
    token: 'fake-token',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionService],
    });
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with isLogged as false', () => {
      expect(service.isLogged).toBeFalsy();
    });

    it('should initialize with undefined sessionInformation', () => {
      expect(service.sessionInformation).toBeUndefined();
    });

    it('should initialize with isLogged observable as false', (done) => {
      service.$isLogged().subscribe((isLogged) => {
        expect(isLogged).toBeFalsy();
        done();
      });
    });
  });

  describe('logIn', () => {
    it('should set session information', () => {
      service.logIn(mockSessionInformation);
      expect(service.sessionInformation).toEqual(mockSessionInformation);
    });

    it('should set isLogged to true', () => {
      service.logIn(mockSessionInformation);
      expect(service.isLogged).toBeTruthy();
    });

    it('should emit true on isLogged observable', (done) => {
      service.$isLogged().subscribe((isLogged) => {
        expect(isLogged).toBeTruthy();
        done();
      });
      service.logIn(mockSessionInformation);
    });
  });

  describe('logOut', () => {
    beforeEach(() => {
      // Mettre l'utilisateur en état connecté avant chaque test
      service.logIn(mockSessionInformation);
    });

    it('should clear session information', () => {
      service.logOut();
      expect(service.sessionInformation).toBeUndefined();
    });

    it('should set isLogged to false', () => {
      service.logOut();
      expect(service.isLogged).toBeFalsy();
    });

    it('should emit false on isLogged observable', (done) => {
      service.$isLogged().subscribe((isLogged) => {
        expect(isLogged).toBeFalsy();
        done();
      });
      service.logOut();
    });
  });

  describe('$isLogged Observable', () => {
    it('should emit current login status immediately upon subscription', (done) => {
      // Vérifier l'état initial (déconnecté)
      service.$isLogged().subscribe((isLogged) => {
        expect(isLogged).toBeFalsy();
        done();
      });
    });

    it('should emit updated status when logging in and out', (done) => {
      const emittedValues: boolean[] = [];

      service.$isLogged().subscribe((isLogged) => {
        emittedValues.push(isLogged);

        if (emittedValues.length === 3) {
          // Vérifier la séquence complète des émissions
          expect(emittedValues).toEqual([false, true, false]);
          done();
        }
      });

      // Déclencher les changements d'état
      service.logIn(mockSessionInformation);
      service.logOut();
    });
  });
});
