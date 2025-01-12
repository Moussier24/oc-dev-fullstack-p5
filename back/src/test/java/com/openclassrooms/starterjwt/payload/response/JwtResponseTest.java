package com.openclassrooms.starterjwt.payload.response;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class JwtResponseTest {

    @Test
    public void testConstructorAndGetters() {
        String token = "test.jwt.token";
        Long id = 1L;
        String username = "testuser";
        String firstName = "John";
        String lastName = "Doe";
        Boolean admin = true;

        JwtResponse response = new JwtResponse(token, id, username, firstName, lastName, admin);

        assertEquals(token, response.getToken());
        assertEquals("Bearer", response.getType());
        assertEquals(id, response.getId());
        assertEquals(username, response.getUsername());
        assertEquals(firstName, response.getFirstName());
        assertEquals(lastName, response.getLastName());
        assertEquals(admin, response.getAdmin());
    }

    @Test
    public void testSetters() {
        JwtResponse response = new JwtResponse("", 1L, "", "", "", false);

        String newToken = "new.jwt.token";
        String newType = "NewBearer";
        Long newId = 2L;
        String newUsername = "newuser";
        String newFirstName = "Jane";
        String newLastName = "Smith";
        Boolean newAdmin = true;

        response.setToken(newToken);
        response.setType(newType);
        response.setId(newId);
        response.setUsername(newUsername);
        response.setFirstName(newFirstName);
        response.setLastName(newLastName);
        response.setAdmin(newAdmin);

        assertEquals(newToken, response.getToken());
        assertEquals(newType, response.getType());
        assertEquals(newId, response.getId());
        assertEquals(newUsername, response.getUsername());
        assertEquals(newFirstName, response.getFirstName());
        assertEquals(newLastName, response.getLastName());
        assertEquals(newAdmin, response.getAdmin());
    }
}