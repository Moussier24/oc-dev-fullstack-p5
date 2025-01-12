package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests unitaires pour UserDetailsImpl
 */
public class UserDetailsImplTest {

    /**
     * Test la création d'un UserDetailsImpl avec le Builder
     * Vérifie que tous les champs sont correctement initialisés
     */
    @Test
    public void testBuildUserDetails() {
        // GIVEN
        Long id = 1L;
        String username = "test@test.com";
        String firstName = "John";
        String lastName = "Doe";
        String password = "password123";
        Boolean admin = true;

        // WHEN
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(id)
                .username(username)
                .firstName(firstName)
                .lastName(lastName)
                .password(password)
                .admin(admin)
                .build();

        // THEN
        assertEquals(id, userDetails.getId());
        assertEquals(username, userDetails.getUsername());
        assertEquals(firstName, userDetails.getFirstName());
        assertEquals(lastName, userDetails.getLastName());
        assertEquals(password, userDetails.getPassword());
        assertEquals(admin, userDetails.getAdmin());
    }

    /**
     * Test les méthodes de l'interface UserDetails
     * Vérifie que les méthodes retournent les valeurs attendues
     */
    @Test
    public void testUserDetailsInterface() {
        // GIVEN
        UserDetailsImpl userDetails = new UserDetailsImpl();

        // WHEN & THEN
        assertTrue(userDetails.isAccountNonExpired());
        assertTrue(userDetails.isAccountNonLocked());
        assertTrue(userDetails.isCredentialsNonExpired());
        assertTrue(userDetails.isEnabled());
    }

    /**
     * Test la méthode getAuthorities
     * Vérifie que la collection d'autorités est vide
     */
    @Test
    public void testGetAuthorities() {
        // GIVEN
        UserDetailsImpl userDetails = new UserDetailsImpl();

        // WHEN
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();

        // THEN
        assertNotNull(authorities);
        assertTrue(authorities.isEmpty());
    }

    /**
     * Test la méthode equals avec le même objet
     * Vérifie que l'objet est égal à lui-même
     */
    @Test
    public void testEquals_SameObject() {
        // GIVEN
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("test@test.com")
                .build();

        // WHEN & THEN
        assertTrue(userDetails.equals(userDetails));
    }

    /**
     * Test la méthode equals avec un objet null
     * Vérifie que l'objet n'est pas égal à null
     */
    @Test
    public void testEquals_Null() {
        // GIVEN
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("test@test.com")
                .build();

        // WHEN & THEN
        assertFalse(userDetails.equals(null));
    }

    /**
     * Test la méthode equals avec un objet d'une autre classe
     * Vérifie que l'objet n'est pas égal à un objet d'un autre type
     */
    @Test
    public void testEquals_DifferentClass() {
        // GIVEN
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("test@test.com")
                .build();

        // WHEN & THEN
        assertFalse(userDetails.equals(new Object()));
    }

    /**
     * Test la méthode equals avec deux objets ayant le même ID
     * Vérifie que deux objets avec le même ID sont considérés comme égaux
     */
    @Test
    public void testEquals_SameId() {
        // GIVEN
        UserDetailsImpl userDetails1 = UserDetailsImpl.builder()
                .id(1L)
                .username("test1@test.com")
                .build();

        UserDetailsImpl userDetails2 = UserDetailsImpl.builder()
                .id(1L)
                .username("test2@test.com")
                .build();

        // WHEN & THEN
        assertTrue(userDetails1.equals(userDetails2));
    }

    /**
     * Test la méthode equals avec deux objets ayant des IDs différents
     * Vérifie que deux objets avec des IDs différents ne sont pas considérés comme
     * égaux
     */
    @Test
    public void testEquals_DifferentId() {
        // GIVEN
        UserDetailsImpl userDetails1 = UserDetailsImpl.builder()
                .id(1L)
                .username("test@test.com")
                .build();

        UserDetailsImpl userDetails2 = UserDetailsImpl.builder()
                .id(2L)
                .username("test@test.com")
                .build();

        // WHEN & THEN
        assertFalse(userDetails1.equals(userDetails2));
    }
}