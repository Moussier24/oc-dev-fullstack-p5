package com.openclassrooms.starterjwt.dto;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class UserDtoTest {

    @Test
    void testUserDtoGettersAndSetters() {
        // Given
        UserDto userDto = new UserDto();
        Long id = 1L;
        String email = "john.doe@test.com";
        String lastName = "Doe";
        String firstName = "John";
        boolean admin = true;
        String password = "password123";
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime updatedAt = LocalDateTime.now();

        // When
        userDto.setId(id);
        userDto.setEmail(email);
        userDto.setLastName(lastName);
        userDto.setFirstName(firstName);
        userDto.setAdmin(admin);
        userDto.setPassword(password);
        userDto.setCreatedAt(createdAt);
        userDto.setUpdatedAt(updatedAt);

        // Then
        assertEquals(id, userDto.getId());
        assertEquals(email, userDto.getEmail());
        assertEquals(lastName, userDto.getLastName());
        assertEquals(firstName, userDto.getFirstName());
        assertTrue(userDto.isAdmin());
        assertEquals(password, userDto.getPassword());
        assertEquals(createdAt, userDto.getCreatedAt());
        assertEquals(updatedAt, userDto.getUpdatedAt());
    }

    @Test
    void testUserDtoDefaultConstructor() {
        // When
        UserDto userDto = new UserDto();

        // Then
        assertNull(userDto.getId());
        assertNull(userDto.getEmail());
        assertNull(userDto.getLastName());
        assertNull(userDto.getFirstName());
        assertFalse(userDto.isAdmin());
        assertNull(userDto.getPassword());
        assertNull(userDto.getCreatedAt());
        assertNull(userDto.getUpdatedAt());
    }

    @Test
    void testUserDtoAllArgsConstructor() {
        // Given
        Long id = 1L;
        String email = "john.doe@test.com";
        String lastName = "Doe";
        String firstName = "John";
        boolean admin = true;
        String password = "password123";
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime updatedAt = LocalDateTime.now();

        // When
        UserDto userDto = new UserDto(id, email, lastName, firstName, admin, password, createdAt, updatedAt);

        // Then
        assertEquals(id, userDto.getId());
        assertEquals(email, userDto.getEmail());
        assertEquals(lastName, userDto.getLastName());
        assertEquals(firstName, userDto.getFirstName());
        assertTrue(userDto.isAdmin());
        assertEquals(password, userDto.getPassword());
        assertEquals(createdAt, userDto.getCreatedAt());
        assertEquals(updatedAt, userDto.getUpdatedAt());
    }

    @Test
    void testUserDtoEqualsAndHashCode() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        UserDto user1 = new UserDto(1L, "john.doe@test.com", "Doe", "John", true, "password123", now, now);
        UserDto user2 = new UserDto(1L, "john.doe@test.com", "Doe", "John", true, "password123", now, now);

        // Then
        assertEquals(user1, user2);
        assertEquals(user1.hashCode(), user2.hashCode());
    }

    @Test
    void testUserDtoToString() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        UserDto user = new UserDto(1L, "john.doe@test.com", "Doe", "John", true, "password123", now, now);

        // When
        String toString = user.toString();

        // Then
        assertTrue(toString.contains("1"));
        assertTrue(toString.contains("john.doe@test.com"));
        assertTrue(toString.contains("Doe"));
        assertTrue(toString.contains("John"));
        assertTrue(toString.contains("true"));
        // Le mot de passe ne devrait pas apparaître dans toString car il est marqué
        // @JsonIgnore
        assertFalse(toString.contains("password123"));
    }
}