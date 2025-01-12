package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests unitaires pour UserController
 */
@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @Mock
    private UserMapper userMapper;

    @Mock
    private UserService userService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private UserController userController;

    private User user;
    private UserDto userDto;

    /**
     * Configuration initiale avant chaque test
     */
    @BeforeEach
    public void setup() {
        // Configuration de l'utilisateur
        user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");
        user.setLastName("Doe");
        user.setFirstName("John");
        user.setPassword("password");
        user.setAdmin(false);

        // Configuration du DTO d'utilisateur
        userDto = new UserDto();
        userDto.setId(1L);
        userDto.setEmail("test@test.com");
        userDto.setLastName("Doe");
        userDto.setFirstName("John");
        userDto.setAdmin(false);

        // Configuration du contexte de sécurité
        SecurityContextHolder.setContext(securityContext);
    }

    /**
     * Test la récupération d'un utilisateur par ID quand il existe
     * Vérifie que la réponse est OK et contient l'utilisateur
     */
    @Test
    public void testFindById_Success() {
        // GIVEN
        when(userService.findById(1L)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userDto);

        // WHEN
        ResponseEntity<?> response = userController.findById("1");

        // THEN
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof UserDto);
        assertEquals(userDto, response.getBody());
    }

    /**
     * Test la récupération d'un utilisateur par ID quand il n'existe pas
     * Vérifie que la réponse est NOT_FOUND
     */
    @Test
    public void testFindById_NotFound() {
        // GIVEN
        when(userService.findById(1L)).thenReturn(null);

        // WHEN
        ResponseEntity<?> response = userController.findById("1");

        // THEN
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    /**
     * Test la récupération d'un utilisateur avec un ID invalide
     * Vérifie que la réponse est BAD_REQUEST
     */
    @Test
    public void testFindById_InvalidId() {
        // WHEN
        ResponseEntity<?> response = userController.findById("invalid");

        // THEN
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    /**
     * Test la suppression d'un utilisateur quand l'utilisateur authentifié est le
     * même
     * Vérifie que la réponse est OK
     */
    @Test
    public void testDelete_Success() {
        // GIVEN
        when(userService.findById(1L)).thenReturn(user);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("test@test.com");

        // WHEN
        ResponseEntity<?> response = userController.save("1");

        // THEN
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService, times(1)).delete(1L);
    }

    /**
     * Test la suppression d'un utilisateur quand l'utilisateur authentifié est
     * différent
     * Vérifie que la réponse est UNAUTHORIZED
     */
    @Test
    public void testDelete_Unauthorized() {
        // GIVEN
        when(userService.findById(1L)).thenReturn(user);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("other@test.com");

        // WHEN
        ResponseEntity<?> response = userController.save("1");

        // THEN
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verify(userService, never()).delete(anyLong());
    }

    /**
     * Test la suppression d'un utilisateur qui n'existe pas
     * Vérifie que la réponse est NOT_FOUND
     */
    @Test
    public void testDelete_NotFound() {
        // GIVEN
        when(userService.findById(1L)).thenReturn(null);

        // WHEN
        ResponseEntity<?> response = userController.save("1");

        // THEN
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(userService, never()).delete(anyLong());
    }

    /**
     * Test la suppression avec un ID invalide
     * Vérifie que la réponse est BAD_REQUEST
     */
    @Test
    public void testDelete_InvalidId() {
        // WHEN
        ResponseEntity<?> response = userController.save("invalid");

        // THEN
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(userService, never()).delete(anyLong());
    }
}