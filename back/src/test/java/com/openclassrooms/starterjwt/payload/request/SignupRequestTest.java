package com.openclassrooms.starterjwt.payload.request;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class SignupRequestTest {

    @Test
    void testSignupRequestGettersAndSetters() {
        // Given
        SignupRequest signupRequest = new SignupRequest();
        String email = "test@test.com";
        String firstName = "John";
        String lastName = "Doe";
        String password = "password123";

        // When
        signupRequest.setEmail(email);
        signupRequest.setFirstName(firstName);
        signupRequest.setLastName(lastName);
        signupRequest.setPassword(password);

        // Then
        assertEquals(email, signupRequest.getEmail());
        assertEquals(firstName, signupRequest.getFirstName());
        assertEquals(lastName, signupRequest.getLastName());
        assertEquals(password, signupRequest.getPassword());
    }

    @Test
    void testSignupRequestDefaultConstructor() {
        // When
        SignupRequest signupRequest = new SignupRequest();

        // Then
        assertNull(signupRequest.getEmail());
        assertNull(signupRequest.getFirstName());
        assertNull(signupRequest.getLastName());
        assertNull(signupRequest.getPassword());
    }

    @Test
    void testSignupRequestEqualsAndHashCode() {
        // Given
        SignupRequest request1 = new SignupRequest();
        SignupRequest request2 = new SignupRequest();

        request1.setEmail("test@test.com");
        request1.setFirstName("John");
        request1.setLastName("Doe");
        request1.setPassword("password123");

        request2.setEmail("test@test.com");
        request2.setFirstName("John");
        request2.setLastName("Doe");
        request2.setPassword("password123");

        // Then
        assertEquals(request1, request2);
        assertEquals(request1.hashCode(), request2.hashCode());
    }

    @Test
    void testSignupRequestToString() {
        // Given
        SignupRequest request = new SignupRequest();
        request.setEmail("test@test.com");
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setPassword("password123");

        // When
        String toString = request.toString();

        // Then
        assertTrue(toString.contains("test@test.com"));
        assertTrue(toString.contains("John"));
        assertTrue(toString.contains("Doe"));
        assertTrue(toString.contains("password123"));
    }
}