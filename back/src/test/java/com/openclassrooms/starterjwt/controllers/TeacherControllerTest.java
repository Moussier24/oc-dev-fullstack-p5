package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests unitaires pour TeacherController
 */
@ExtendWith(MockitoExtension.class)
public class TeacherControllerTest {

    @Mock
    private TeacherMapper teacherMapper;

    @Mock
    private TeacherService teacherService;

    @InjectMocks
    private TeacherController teacherController;

    private Teacher teacher;
    private TeacherDto teacherDto;

    /**
     * Configuration initiale avant chaque test
     */
    @BeforeEach
    public void setup() {
        // Configuration du professeur
        teacher = new Teacher();
        teacher.setId(1L);
        teacher.setLastName("Doe");
        teacher.setFirstName("John");
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());

        // Configuration du DTO de professeur
        teacherDto = new TeacherDto();
        teacherDto.setId(1L);
        teacherDto.setLastName("Doe");
        teacherDto.setFirstName("John");
        teacherDto.setCreatedAt(LocalDateTime.now());
        teacherDto.setUpdatedAt(LocalDateTime.now());
    }

    /**
     * Test la récupération d'un professeur par ID quand il existe
     * Vérifie que la réponse est OK et contient le professeur
     */
    @Test
    public void testFindById_Success() {
        // GIVEN
        when(teacherService.findById(1L)).thenReturn(teacher);
        when(teacherMapper.toDto(teacher)).thenReturn(teacherDto);

        // WHEN
        ResponseEntity<?> response = teacherController.findById("1");

        // THEN
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof TeacherDto);
        assertEquals(teacherDto, response.getBody());
    }

    /**
     * Test la récupération d'un professeur par ID quand il n'existe pas
     * Vérifie que la réponse est NOT_FOUND
     */
    @Test
    public void testFindById_NotFound() {
        // GIVEN
        when(teacherService.findById(1L)).thenReturn(null);

        // WHEN
        ResponseEntity<?> response = teacherController.findById("1");

        // THEN
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    /**
     * Test la récupération d'un professeur avec un ID invalide
     * Vérifie que la réponse est BAD_REQUEST
     */
    @Test
    public void testFindById_InvalidId() {
        // WHEN
        ResponseEntity<?> response = teacherController.findById("invalid");

        // THEN
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    /**
     * Test la récupération de tous les professeurs
     * Vérifie que la réponse est OK et contient la liste des professeurs
     */
    @Test
    public void testFindAll() {
        // GIVEN
        List<Teacher> teachers = Arrays.asList(teacher);
        List<TeacherDto> teacherDtos = Arrays.asList(teacherDto);
        when(teacherService.findAll()).thenReturn(teachers);
        when(teacherMapper.toDto(teachers)).thenReturn(teacherDtos);

        // WHEN
        ResponseEntity<?> response = teacherController.findAll();

        // THEN
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof List);
        assertEquals(teacherDtos, response.getBody());
    }
} 
