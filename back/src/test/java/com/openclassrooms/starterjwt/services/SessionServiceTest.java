package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests unitaires pour le service SessionService
 */
@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    private Session session;
    private User user;

    /**
     * Configuration initiale avant chaque test
     */
    @BeforeEach
    public void setup() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");
        user.setFirstName("John");
        user.setLastName("Doe");

        session = new Session();
        session.setId(1L);
        session.setName("Yoga Session");
        session.setDescription("A relaxing yoga session");
        session.setUsers(new ArrayList<>());
    }

    /**
     * Test la création d'une session
     * Vérifie que la méthode save du repository est appelée et retourne la session
     * créée
     */
    @Test
    public void testCreate() {
        // GIVEN
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        // WHEN
        Session createdSession = sessionService.create(session);

        // THEN
        assertNotNull(createdSession);
        assertEquals(session.getName(), createdSession.getName());
        verify(sessionRepository, times(1)).save(session);
    }

    /**
     * Test la suppression d'une session
     * Vérifie que la méthode deleteById du repository est appelée
     */
    @Test
    public void testDelete() {
        // WHEN
        sessionService.delete(1L);

        // THEN
        verify(sessionRepository, times(1)).deleteById(1L);
    }

    /**
     * Test la récupération de toutes les sessions
     * Vérifie que la méthode findAll du repository est appelée et retourne la liste
     * attendue
     */
    @Test
    public void testFindAll() {
        // GIVEN
        List<Session> sessions = Arrays.asList(session);
        when(sessionRepository.findAll()).thenReturn(sessions);

        // WHEN
        List<Session> foundSessions = sessionService.findAll();

        // THEN
        assertNotNull(foundSessions);
        assertEquals(1, foundSessions.size());
        verify(sessionRepository, times(1)).findAll();
    }

    /**
     * Test la récupération d'une session par ID quand elle existe
     * Vérifie que la méthode findById du repository est appelée et retourne la
     * session attendue
     */
    @Test
    public void testGetById_SessionExists() {
        // GIVEN
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        // WHEN
        Session foundSession = sessionService.getById(1L);

        // THEN
        assertNotNull(foundSession);
        assertEquals(session.getId(), foundSession.getId());
        verify(sessionRepository, times(1)).findById(1L);
    }

    /**
     * Test la récupération d'une session par ID quand elle n'existe pas
     * Vérifie que null est retourné quand la session n'existe pas
     */
    @Test
    public void testGetById_SessionDoesNotExist() {
        // GIVEN
        when(sessionRepository.findById(999L)).thenReturn(Optional.empty());

        // WHEN
        Session foundSession = sessionService.getById(999L);

        // THEN
        assertNull(foundSession);
        verify(sessionRepository, times(1)).findById(999L);
    }

    /**
     * Test la mise à jour d'une session
     * Vérifie que la méthode save du repository est appelée avec l'ID correct
     */
    @Test
    public void testUpdate() {
        // GIVEN
        Session existingSession = new Session();
        existingSession.setId(1L);
        Session updatedSession = new Session();
        updatedSession.setName("Updated Session");
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(existingSession));
        when(sessionRepository.save(any(Session.class))).thenReturn(updatedSession);

        // WHEN
        Session result = sessionService.update(1L, updatedSession);

        // THEN
        assertEquals(1L, updatedSession.getId());
        assertEquals("Updated Session", result.getName());
        verify(sessionRepository, times(1)).findById(1L);
        verify(sessionRepository, times(1)).save(updatedSession);
    }

    @Test
    public void testUpdate_SessionNotFound() {
        // GIVEN
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());
        Session updatedSession = new Session();
        updatedSession.setName("Updated Session");

        // WHEN
        Session result = sessionService.update(1L, updatedSession);

        // THEN
        assertNull(result);
        verify(sessionRepository, times(1)).findById(1L);
        verify(sessionRepository, never()).save(any());
    }

    /**
     * Test l'inscription d'un utilisateur à une session avec succès
     * Vérifie que la session et l'utilisateur sont trouvés et que l'utilisateur est
     * ajouté
     */
    @Test
    public void testParticipate_Success() {
        // GIVEN
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        // WHEN
        sessionService.participate(1L, 1L);

        // THEN
        verify(sessionRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).findById(1L);
        verify(sessionRepository, times(1)).save(session);
        assertTrue(session.getUsers().contains(user));
    }

    /**
     * Test l'inscription à une session quand la session n'existe pas
     * Vérifie qu'une NotFoundException est lancée
     */
    @Test
    public void testParticipate_SessionNotFound() {
        // GIVEN
        when(sessionRepository.findById(999L)).thenReturn(Optional.empty());

        // WHEN & THEN
        assertThrows(NotFoundException.class, () -> sessionService.participate(999L, 1L));
    }

    /**
     * Test l'inscription à une session quand l'utilisateur est déjà inscrit
     * Vérifie qu'une BadRequestException est lancée
     */
    @Test
    public void testParticipate_AlreadyParticipating() {
        // GIVEN
        session.getUsers().add(user);
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // WHEN & THEN
        assertThrows(BadRequestException.class, () -> sessionService.participate(1L, 1L));
    }

    /**
     * Test la désinscription d'un utilisateur d'une session avec succès
     * Vérifie que l'utilisateur est bien retiré de la liste des participants
     */
    @Test
    public void testNoLongerParticipate_Success() {
        // GIVEN
        session.getUsers().add(user);
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        // WHEN
        sessionService.noLongerParticipate(1L, 1L);

        // THEN
        verify(sessionRepository, times(1)).findById(1L);
        verify(sessionRepository, times(1)).save(session);
        assertFalse(session.getUsers().contains(user));
    }

    /**
     * Test la désinscription d'une session qui n'existe pas
     * Vérifie qu'une NotFoundException est lancée
     */
    @Test
    public void testNoLongerParticipate_SessionNotFound() {
        // GIVEN
        when(sessionRepository.findById(999L)).thenReturn(Optional.empty());

        // WHEN & THEN
        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(999L, 1L));
    }

    /**
     * Test la désinscription d'un utilisateur non inscrit
     * Vérifie qu'une BadRequestException est lancée
     */
    @Test
    public void testNoLongerParticipate_NotParticipating() {
        // GIVEN
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        // WHEN & THEN
        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(1L, 1L));
    }
}