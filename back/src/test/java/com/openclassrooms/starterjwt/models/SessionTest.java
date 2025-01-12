package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Tests unitaires pour la classe Session
 * Cette classe teste les fonctionnalités de base de l'entité Session
 * y compris les relations avec Teacher et User
 */
public class SessionTest {

    /**
     * Test la création basique d'une session avec le constructeur par défaut
     * Vérifie que l'objet est bien créé et non null
     */
    @Test
    public void testCreateSession() {
        Session session = new Session();
        assertNotNull(session);
    }

    /**
     * Test la création d'une session en utilisant le pattern Builder
     * Vérifie que :
     * - L'objet est bien créé
     * - Tous les champs sont correctement initialisés via le builder
     * - Les relations (Teacher et List<User>) sont correctement gérées
     */
    @Test
    public void testSessionBuilder() {
        Date sessionDate = new Date();
        Teacher teacher = new Teacher();
        List<User> users = new ArrayList<>();

        Session session = Session.builder()
                .name("Yoga Session")
                .date(sessionDate)
                .description("A relaxing yoga session")
                .teacher(teacher)
                .users(users)
                .build();

        assertNotNull(session);
        assertEquals("Yoga Session", session.getName());
        assertEquals(sessionDate, session.getDate());
        assertEquals("A relaxing yoga session", session.getDescription());
        assertEquals(teacher, session.getTeacher());
        assertEquals(users, session.getUsers());
    }

    /**
     * Test tous les getters et setters de la classe Session
     * Vérifie que :
     * - Chaque setter modifie correctement la valeur
     * - Chaque getter retourne la bonne valeur
     * - Les types de données sont correctement gérés (Long, String, Date,
     * LocalDateTime)
     * - Les relations (Teacher et List<User>) sont correctement gérées
     */
    @Test
    public void testSessionSettersAndGetters() {
        Session session = new Session();
        Date sessionDate = new Date();
        Teacher teacher = new Teacher();
        List<User> users = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        session.setId(1L);
        session.setName("Yoga Session");
        session.setDate(sessionDate);
        session.setDescription("A relaxing yoga session");
        session.setTeacher(teacher);
        session.setUsers(users);
        session.setCreatedAt(now);
        session.setUpdatedAt(now);

        assertEquals(1L, session.getId());
        assertEquals("Yoga Session", session.getName());
        assertEquals(sessionDate, session.getDate());
        assertEquals("A relaxing yoga session", session.getDescription());
        assertEquals(teacher, session.getTeacher());
        assertEquals(users, session.getUsers());
        assertEquals(now, session.getCreatedAt());
        assertEquals(now, session.getUpdatedAt());
    }

    /**
     * Test les méthodes equals() et hashCode()
     * Vérifie que :
     * - Deux sessions avec le même ID sont considérées comme égales
     * - Deux sessions avec des IDs différents sont considérées comme différentes
     * - Le hashCode est cohérent avec equals
     */
    @Test
    public void testEqualsAndHashCode() {
        Session session1 = new Session();
        Session session2 = new Session();

        session1.setId(1L);
        session2.setId(1L);

        assertEquals(session1, session2);
        assertEquals(session1.hashCode(), session2.hashCode());

        session2.setId(2L);
        assertNotEquals(session1, session2);
        assertNotEquals(session1.hashCode(), session2.hashCode());
    }

    /**
     * Test la méthode toString()
     * Vérifie que :
     * - La chaîne générée contient les informations importantes de la session
     * - Le format est correct et inclut l'ID, le nom et la description
     */
    @Test
    public void testToString() {
        Session session = Session.builder()
                .id(1L)
                .name("Yoga Session")
                .description("A relaxing yoga session")
                .build();

        String toString = session.toString();

        assertTrue(toString.contains("id=1"));
        assertTrue(toString.contains("name=Yoga Session"));
        assertTrue(toString.contains("description=A relaxing yoga session"));
    }
}