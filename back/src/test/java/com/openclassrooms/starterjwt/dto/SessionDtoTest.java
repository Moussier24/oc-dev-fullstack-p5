package com.openclassrooms.starterjwt.dto;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SessionDtoTest {

    @Test
    void testSessionDtoGettersAndSetters() {
        // Given
        SessionDto sessionDto = new SessionDto();
        Long id = 1L;
        String name = "Yoga Session";
        Date date = new Date();
        Long teacherId = 2L;
        String description = "A relaxing yoga session";
        List<Long> users = Arrays.asList(1L, 2L, 3L);
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime updatedAt = LocalDateTime.now();

        // When
        sessionDto.setId(id);
        sessionDto.setName(name);
        sessionDto.setDate(date);
        sessionDto.setTeacher_id(teacherId);
        sessionDto.setDescription(description);
        sessionDto.setUsers(users);
        sessionDto.setCreatedAt(createdAt);
        sessionDto.setUpdatedAt(updatedAt);

        // Then
        assertEquals(id, sessionDto.getId());
        assertEquals(name, sessionDto.getName());
        assertEquals(date, sessionDto.getDate());
        assertEquals(teacherId, sessionDto.getTeacher_id());
        assertEquals(description, sessionDto.getDescription());
        assertEquals(users, sessionDto.getUsers());
        assertEquals(createdAt, sessionDto.getCreatedAt());
        assertEquals(updatedAt, sessionDto.getUpdatedAt());
    }

    @Test
    void testSessionDtoDefaultConstructor() {
        // When
        SessionDto sessionDto = new SessionDto();

        // Then
        assertNull(sessionDto.getId());
        assertNull(sessionDto.getName());
        assertNull(sessionDto.getDate());
        assertNull(sessionDto.getTeacher_id());
        assertNull(sessionDto.getDescription());
        assertNull(sessionDto.getUsers());
        assertNull(sessionDto.getCreatedAt());
        assertNull(sessionDto.getUpdatedAt());
    }

    @Test
    void testSessionDtoAllArgsConstructor() {
        // Given
        Long id = 1L;
        String name = "Yoga Session";
        Date date = new Date();
        Long teacherId = 2L;
        String description = "A relaxing yoga session";
        List<Long> users = Arrays.asList(1L, 2L, 3L);
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime updatedAt = LocalDateTime.now();

        // When
        SessionDto sessionDto = new SessionDto(id, name, date, teacherId, description, users, createdAt, updatedAt);

        // Then
        assertEquals(id, sessionDto.getId());
        assertEquals(name, sessionDto.getName());
        assertEquals(date, sessionDto.getDate());
        assertEquals(teacherId, sessionDto.getTeacher_id());
        assertEquals(description, sessionDto.getDescription());
        assertEquals(users, sessionDto.getUsers());
        assertEquals(createdAt, sessionDto.getCreatedAt());
        assertEquals(updatedAt, sessionDto.getUpdatedAt());
    }

    @Test
    void testSessionDtoEqualsAndHashCode() {
        // Given
        Date date = new Date();
        LocalDateTime now = LocalDateTime.now();
        List<Long> users = Arrays.asList(1L, 2L, 3L);

        SessionDto session1 = new SessionDto(1L, "Yoga", date, 2L, "Description", users, now, now);
        SessionDto session2 = new SessionDto(1L, "Yoga", date, 2L, "Description", users, now, now);

        // Then
        assertEquals(session1, session2);
        assertEquals(session1.hashCode(), session2.hashCode());
    }

    @Test
    void testSessionDtoToString() {
        // Given
        Date date = new Date();
        LocalDateTime now = LocalDateTime.now();
        List<Long> users = Arrays.asList(1L, 2L, 3L);
        SessionDto session = new SessionDto(1L, "Yoga", date, 2L, "Description", users, now, now);

        // When
        String toString = session.toString();

        // Then
        assertTrue(toString.contains("1"));
        assertTrue(toString.contains("Yoga"));
        assertTrue(toString.contains("Description"));
        assertTrue(toString.contains("2"));
        assertTrue(toString.contains(users.toString()));
    }
}