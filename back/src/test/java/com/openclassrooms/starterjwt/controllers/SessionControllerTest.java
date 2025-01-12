package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests unitaires pour SessionController
 */
@ExtendWith(MockitoExtension.class)
public class SessionControllerTest {

    @Mock
    private SessionMapper sessionMapper;

    @Mock
    private SessionService sessionService;

    @InjectMocks
    private SessionController sessionController;

    private Session session;
    private SessionDto sessionDto;
    private User user;

    /**
     * Configuration initiale avant chaque test
     */
    @BeforeEach
    public void setup() {
        // Configuration de la session
        session = new Session();
        session.setId(1L);
        session.setName("Yoga Session");
        session.setDate(new Date());
        session.setDescription("A relaxing yoga session");

        // Configuration du DTO de session
        sessionDto = new SessionDto();
        sessionDto.setId(1L);
        sessionDto.setName("Yoga Session");
        sessionDto.setDate(new Date());
        sessionDto.setDescription("A relaxing yoga session");

        // Configuration de l'utilisateur
        user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");
    }

    /**
     * Test la récupération d'une session par ID quand elle existe
     * Vérifie que la réponse est OK et contient la session
     */
    @Test
    public void testFindById_Success() {
        // GIVEN
        when(sessionService.getById(1L)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        // WHEN
        ResponseEntity<?> response = sessionController.findById("1");

        // THEN
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof SessionDto);
        assertEquals(sessionDto, response.getBody());
    }

    /**
     * Test la récupération d'une session par ID quand elle n'existe pas
     * Vérifie que la réponse est NOT_FOUND
     */
    @Test
    public void testFindById_NotFound() {
        // GIVEN
        when(sessionService.getById(1L)).thenReturn(null);

        // WHEN
        ResponseEntity<?> response = sessionController.findById("1");

        // THEN
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    /**
     * Test la récupération d'une session avec un ID invalide
     * Vérifie que la réponse est BAD_REQUEST
     */
    @Test
    public void testFindById_InvalidId() {
        // WHEN
        ResponseEntity<?> response = sessionController.findById("invalid");

        // THEN
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    /**
     * Test la récupération de toutes les sessions
     * Vérifie que la réponse est OK et contient la liste des sessions
     */
    @Test
    public void testFindAll() {
        // GIVEN
        List<Session> sessions = Arrays.asList(session);
        List<SessionDto> sessionDtos = Arrays.asList(sessionDto);
        when(sessionService.findAll()).thenReturn(sessions);
        when(sessionMapper.toDto(sessions)).thenReturn(sessionDtos);

        // WHEN
        ResponseEntity<?> response = sessionController.findAll();

        // THEN
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof List);
        assertEquals(sessionDtos, response.getBody());
    }

    /**
     * Test la création d'une session
     * Vérifie que la réponse est OK et contient la session créée
     */
    @Test
    public void testCreate() {
        // GIVEN
        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.create(session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        // WHEN
        ResponseEntity<?> response = sessionController.create(sessionDto);

        // THEN
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof SessionDto);
        assertEquals(sessionDto, response.getBody());
    }

    /**
     * Test la mise à jour d'une session existante
     * Vérifie que la réponse est OK et contient la session mise à jour
     */
    @Test
    public void testUpdate_Success() {
        // GIVEN
        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.update(eq(1L), any(Session.class))).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        // WHEN
        ResponseEntity<?> response = sessionController.update("1", sessionDto);

        // THEN
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof SessionDto);
        assertEquals(sessionDto, response.getBody());
    }

    /**
     * Test la mise à jour d'une session qui n'existe pas
     * Vérifie que la réponse est NOT_FOUND
     */
    @Test
    public void testUpdate_NotFound() {
        // GIVEN
        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.update(eq(1L), any(Session.class))).thenReturn(null);

        // WHEN
        ResponseEntity<?> response = sessionController.update("1", sessionDto);

        // THEN
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    /**
     * Test la mise à jour avec un ID invalide
     * Vérifie que la réponse est BAD_REQUEST
     */
    @Test
    public void testUpdate_InvalidId() {
        // WHEN
        ResponseEntity<?> response = sessionController.update("invalid", sessionDto);

        // THEN
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    /**
     * Test la suppression d'une session
     * Vérifie que la réponse est OK
     */
    @Test
    public void testDelete_Success() {
        // WHEN
        ResponseEntity<?> response = sessionController.delete("1");

        // THEN
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(sessionService, times(1)).delete(1L);
    }

    /**
     * Test la suppression avec un ID invalide
     * Vérifie que la réponse est BAD_REQUEST
     */
    @Test
    public void testDelete_InvalidId() {
        // WHEN
        ResponseEntity<?> response = sessionController.delete("invalid");

        // THEN
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(sessionService, never()).delete(any());
    }

    /**
     * Test la participation à une session
     * Vérifie que la réponse est OK
     */
    @Test
    public void testParticipate_Success() {
        // WHEN
        ResponseEntity<?> response = sessionController.participate("1", "1");

        // THEN
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(sessionService, times(1)).participate(1L, 1L);
    }

    /**
     * Test la participation avec des IDs invalides
     * Vérifie que la réponse est BAD_REQUEST
     */
    @Test
    public void testParticipate_InvalidIds() {
        // WHEN
        ResponseEntity<?> response = sessionController.participate("invalid", "1");

        // THEN
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(sessionService, never()).participate(any(), any());
    }

    /**
     * Test la désinscription d'une session
     * Vérifie que la réponse est OK
     */
    @Test
    public void testNoLongerParticipate_Success() {
        // WHEN
        ResponseEntity<?> response = sessionController.noLongerParticipate("1", "1");

        // THEN
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(sessionService, times(1)).noLongerParticipate(1L, 1L);
    }

    /**
     * Test la désinscription avec des IDs invalides
     * Vérifie que la réponse est BAD_REQUEST
     */
    @Test
    public void testNoLongerParticipate_InvalidIds() {
        // WHEN
        ResponseEntity<?> response = sessionController.noLongerParticipate("invalid", "1");

        // THEN
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(sessionService, never()).noLongerParticipate(any(), any());
    }
}