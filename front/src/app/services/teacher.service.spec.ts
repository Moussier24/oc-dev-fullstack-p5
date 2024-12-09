import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface';
import { of } from 'rxjs';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpClient: HttpClient;

  const mockTeacher: Teacher = {
    id: 1,
    lastName: 'Doe',
    firstName: 'John',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTeachers: Teacher[] = [
    mockTeacher,
    {
      id: 2,
      lastName: 'Smith',
      firstName: 'Jane',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        {
          provide: HttpClient,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    });
    service = TestBed.inject(TeacherService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('all', () => {
    it('should call http GET to fetch all teachers', () => {
      jest.spyOn(httpClient, 'get').mockReturnValue(of(mockTeachers));

      service.all().subscribe((teachers) => {
        expect(teachers).toEqual(mockTeachers);
        expect(teachers.length).toBe(2);
        expect(teachers[0].firstName).toBe('John');
        expect(teachers[1].firstName).toBe('Jane');
      });

      expect(httpClient.get).toHaveBeenCalledWith('api/teacher');
    });
  });

  describe('detail', () => {
    it('should call http GET to fetch teacher details', () => {
      jest.spyOn(httpClient, 'get').mockReturnValue(of(mockTeacher));
      const teacherId = '1';

      service.detail(teacherId).subscribe((teacher) => {
        expect(teacher).toEqual(mockTeacher);
        expect(teacher.firstName).toBe('John');
        expect(teacher.lastName).toBe('Doe');
      });

      expect(httpClient.get).toHaveBeenCalledWith(`api/teacher/${teacherId}`);
    });
  });

  describe('Teacher properties', () => {
    it('should verify teacher object structure', () => {
      jest.spyOn(httpClient, 'get').mockReturnValue(of(mockTeacher));
      const teacherId = '1';

      service.detail(teacherId).subscribe((teacher) => {
        expect(teacher).toHaveProperty('id');
        expect(teacher).toHaveProperty('firstName');
        expect(teacher).toHaveProperty('lastName');
        expect(teacher).toHaveProperty('createdAt');
        expect(teacher).toHaveProperty('updatedAt');
      });
    });

    it('should handle dates correctly', () => {
      jest.spyOn(httpClient, 'get').mockReturnValue(of(mockTeacher));
      const teacherId = '1';

      service.detail(teacherId).subscribe((teacher) => {
        expect(teacher.createdAt).toBeInstanceOf(Date);
        expect(teacher.updatedAt).toBeInstanceOf(Date);
      });
    });
  });
});
