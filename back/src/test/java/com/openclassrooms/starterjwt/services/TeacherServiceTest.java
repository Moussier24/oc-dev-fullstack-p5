package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests unitaires pour le service TeacherService
 */
@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    private Teacher teacher;

    /**
     * Configuration initiale avant chaque test
     */
    @BeforeEach
    public void setup() {
        teacher = new Teacher();
        teacher.setId(1L);
        teacher.setLastName("Smith");
        teacher.setFirstName("John");
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());
    }

    /**
     * Test la récupération de tous les professeurs
     * Vérifie que :
     * - La méthode findAll du repository est appelée
     * - La liste retournée contient le bon nombre de professeurs
     * - Les professeurs retournés sont corrects
     */
    @Test
    public void testFindAll() {
        // GIVEN
        List<Teacher> teachers = Arrays.asList(teacher);
        when(teacherRepository.findAll()).thenReturn(teachers);

        // WHEN
        List<Teacher> foundTeachers = teacherService.findAll();

        // THEN
        assertNotNull(foundTeachers);
        assertEquals(1, foundTeachers.size());
        assertEquals(teacher.getId(), foundTeachers.get(0).getId());
        assertEquals(teacher.getLastName(), foundTeachers.get(0).getLastName());
        assertEquals(teacher.getFirstName(), foundTeachers.get(0).getFirstName());
        verify(teacherRepository, times(1)).findAll();
    }

    /**
     * Test la récupération d'un professeur par ID quand il existe
     * Vérifie que :
     * - La méthode findById du repository est appelée avec le bon ID
     * - Le professeur retourné correspond à celui du repository
     */
    @Test
    public void testFindById_TeacherExists() {
        // GIVEN
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));

        // WHEN
        Teacher foundTeacher = teacherService.findById(1L);

        // THEN
        assertNotNull(foundTeacher);
        assertEquals(teacher.getId(), foundTeacher.getId());
        assertEquals(teacher.getLastName(), foundTeacher.getLastName());
        assertEquals(teacher.getFirstName(), foundTeacher.getFirstName());
        verify(teacherRepository, times(1)).findById(1L);
    }

    /**
     * Test la récupération d'un professeur par ID quand il n'existe pas
     * Vérifie que :
     * - La méthode findById du repository est appelée avec le bon ID
     * - Null est retourné quand le professeur n'existe pas
     */
    @Test
    public void testFindById_TeacherDoesNotExist() {
        // GIVEN
        when(teacherRepository.findById(999L)).thenReturn(Optional.empty());

        // WHEN
        Teacher foundTeacher = teacherService.findById(999L);

        // THEN
        assertNull(foundTeacher);
        verify(teacherRepository, times(1)).findById(999L);
    }
}