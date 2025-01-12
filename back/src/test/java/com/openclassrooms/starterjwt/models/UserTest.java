package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.time.LocalDateTime;

/**
 * Tests unitaires pour la classe User
 * Cette classe teste les fonctionnalités de base de l'entité User
 */
public class UserTest {

    /**
     * Test la création d'un utilisateur avec le constructeur avec paramètres
     * Vérifie que :
     * - L'objet est bien créé
     * - Tous les champs sont correctement initialisés
     * - Les dates de création et mise à jour sont automatiquement définies
     */
    @Test
    public void testCreateUser() {
        User user = new User(
                "test@test.com",
                "Doe",
                "John",
                "password123",
                false);

        assertNotNull(user);
        assertEquals("test@test.com", user.getEmail());
        assertEquals("Doe", user.getLastName());
        assertEquals("John", user.getFirstName());
        assertEquals("password123", user.getPassword());
        assertFalse(user.isAdmin());
        assertNotNull(user.getCreatedAt());
        assertNotNull(user.getUpdatedAt());
    }

    /**
     * Test tous les getters et setters de la classe User
     * Vérifie que :
     * - Chaque setter modifie correctement la valeur
     * - Chaque getter retourne la bonne valeur
     * - Les types de données sont correctement gérés (Long, String, boolean,
     * LocalDateTime)
     */
    @Test
    public void testUserSettersAndGetters() {
        User user = new User();

        user.setId(1L);
        user.setEmail("test@test.com");
        user.setLastName("Doe");
        user.setFirstName("John");
        user.setPassword("password123");
        user.setAdmin(true);
        LocalDateTime now = LocalDateTime.now();
        user.setCreatedAt(now);
        user.setUpdatedAt(now);

        assertEquals(1L, user.getId());
        assertEquals("test@test.com", user.getEmail());
        assertEquals("Doe", user.getLastName());
        assertEquals("John", user.getFirstName());
        assertEquals("password123", user.getPassword());
        assertTrue(user.isAdmin());
        assertEquals(now, user.getCreatedAt());
        assertEquals(now, user.getUpdatedAt());
    }
}