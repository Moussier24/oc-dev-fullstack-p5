import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';
import { of, throwError } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let httpClient: HttpClient;

  const mockUser: User = {
    id: 1,
    email: 'john.doe@test.com',
    lastName: 'Doe',
    firstName: 'John',
    admin: false,
    password: 'password123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        {
          provide: HttpClient,
          useValue: {
            get: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    });
    service = TestBed.inject(UserService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getById', () => {
    it('should call http GET to fetch user details', (done) => {
      jest.spyOn(httpClient, 'get').mockReturnValue(of(mockUser));
      const userId = '1';

      service.getById(userId).subscribe({
        next: (user) => {
          expect(user).toEqual(mockUser);
          expect(user.firstName).toBe('John');
          expect(user.lastName).toBe('Doe');
          expect(user.email).toBe('john.doe@test.com');
          done();
        },
        error: done,
      });

      expect(httpClient.get).toHaveBeenCalledWith(`api/user/${userId}`);
    });

    it('should return user with correct structure', (done) => {
      jest.spyOn(httpClient, 'get').mockReturnValue(of(mockUser));
      const userId = '1';

      service.getById(userId).subscribe({
        next: (user) => {
          expect(user).toHaveProperty('id');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('firstName');
          expect(user).toHaveProperty('lastName');
          expect(user).toHaveProperty('admin');
          expect(user).toHaveProperty('password');
          expect(user).toHaveProperty('createdAt');
          expect(user).toHaveProperty('updatedAt');
          done();
        },
        error: done,
      });
    });

    it('should handle dates correctly', (done) => {
      jest.spyOn(httpClient, 'get').mockReturnValue(of(mockUser));
      const userId = '1';

      service.getById(userId).subscribe({
        next: (user) => {
          expect(user.createdAt).toBeInstanceOf(Date);
          expect(user.updatedAt).toBeInstanceOf(Date);
          done();
        },
        error: done,
      });
    });
  });

  describe('delete', () => {
    it('should call http DELETE to remove a user', (done) => {
      jest.spyOn(httpClient, 'delete').mockReturnValue(of({}));
      const userId = '1';

      service.delete(userId).subscribe({
        next: (response) => {
          expect(response).toEqual({});
          done();
        },
        error: done,
      });

      expect(httpClient.delete).toHaveBeenCalledWith(`api/user/${userId}`);
    });

    it('should handle successful deletion', (done) => {
      jest.spyOn(httpClient, 'delete').mockReturnValue(of({}));
      const userId = '1';

      service.delete(userId).subscribe({
        next: (response) => {
          expect(response).toEqual({});
          done();
        },
        error: done,
      });
    });
  });

  describe('Error handling', () => {
    it('should handle http errors for getById', (done) => {
      const errorResponse = new Error('Http failure response');
      jest
        .spyOn(httpClient, 'get')
        .mockReturnValue(throwError(() => errorResponse));
      const userId = '1';

      service.getById(userId).subscribe({
        next: () => {
          done(new Error('Should have failed'));
        },
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('Http failure response');
          done();
        },
      });
    });

    it('should handle http errors for delete', (done) => {
      const errorResponse = new Error('Http failure response');
      jest
        .spyOn(httpClient, 'delete')
        .mockReturnValue(throwError(() => errorResponse));
      const userId = '1';

      service.delete(userId).subscribe({
        next: () => {
          done(new Error('Should have failed'));
        },
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('Http failure response');
          done();
        },
      });
    });
  });
});
