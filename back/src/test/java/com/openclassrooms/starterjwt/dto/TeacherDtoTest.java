package com.openclassrooms.starterjwt.dto;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class TeacherDtoTest {

    @Test
    void testTeacherDtoGettersAndSetters() {
        // Given
        TeacherDto teacherDto = new TeacherDto();
        Long id = 1L;
        String lastName = "Doe";
        String firstName = "John";
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime updatedAt = LocalDateTime.now();

        // When
        teacherDto.setId(id);
        teacherDto.setLastName(lastName);
        teacherDto.setFirstName(firstName);
        teacherDto.setCreatedAt(createdAt);
        teacherDto.setUpdatedAt(updatedAt);

        // Then
        assertEquals(id, teacherDto.getId());
        assertEquals(lastName, teacherDto.getLastName());
        assertEquals(firstName, teacherDto.getFirstName());
        assertEquals(createdAt, teacherDto.getCreatedAt());
        assertEquals(updatedAt, teacherDto.getUpdatedAt());
    }

    @Test
    void testTeacherDtoDefaultConstructor() {
        // When
        TeacherDto teacherDto = new TeacherDto();

        // Then
        assertNull(teacherDto.getId());
        assertNull(teacherDto.getLastName());
        assertNull(teacherDto.getFirstName());
        assertNull(teacherDto.getCreatedAt());
        assertNull(teacherDto.getUpdatedAt());
    }

    @Test
    void testTeacherDtoAllArgsConstructor() {
        // Given
        Long id = 1L;
        String lastName = "Doe";
        String firstName = "John";
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime updatedAt = LocalDateTime.now();

        // When
        TeacherDto teacherDto = new TeacherDto(id, lastName, firstName, createdAt, updatedAt);

        // Then
        assertEquals(id, teacherDto.getId());
        assertEquals(lastName, teacherDto.getLastName());
        assertEquals(firstName, teacherDto.getFirstName());
        assertEquals(createdAt, teacherDto.getCreatedAt());
        assertEquals(updatedAt, teacherDto.getUpdatedAt());
    }

    @Test
    void testTeacherDtoEqualsAndHashCode() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        TeacherDto teacher1 = new TeacherDto(1L, "Doe", "John", now, now);
        TeacherDto teacher2 = new TeacherDto(1L, "Doe", "John", now, now);

        // Then
        assertEquals(teacher1, teacher2);
        assertEquals(teacher1.hashCode(), teacher2.hashCode());
    }

    @Test
    void testTeacherDtoToString() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        TeacherDto teacher = new TeacherDto(1L, "Doe", "John", now, now);

        // When
        String toString = teacher.toString();

        // Then
        assertTrue(toString.contains("1"));
        assertTrue(toString.contains("Doe"));
        assertTrue(toString.contains("John"));
    }
}