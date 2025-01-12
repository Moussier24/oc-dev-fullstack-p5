package com.openclassrooms.starterjwt.payload.request;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class LoginRequestTest {

    @Test
    void testLoginRequestGettersAndSetters() {
        // Given
        LoginRequest loginRequest = new LoginRequest();
        String email = "test@test.com";
        String password = "password123";

        // When
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);

        // Then
        assertEquals(email, loginRequest.getEmail());
        assertEquals(password, loginRequest.getPassword());
    }

    @Test
    void testLoginRequestDefaultConstructor() {
        // When
        LoginRequest loginRequest = new LoginRequest();

        // Then
        assertNull(loginRequest.getEmail());
        assertNull(loginRequest.getPassword());
    }
}