package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests unitaires pour le service UserService
 */
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

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
        user.setPassword("password123");
        user.setAdmin(false);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
    }

    /**
     * Test la suppression d'un utilisateur
     * Vérifie que la méthode deleteById du repository est bien appelée
     */
    @Test
    public void testDelete() {
        // WHEN
        userService.delete(1L);

        // THEN
        verify(userRepository, times(1)).deleteById(1L);
    }

    /**
     * Test la recherche d'un utilisateur par ID quand l'utilisateur existe
     * Vérifie que :
     * - La méthode findById du repository est appelée avec le bon ID
     * - L'utilisateur retourné correspond à celui du repository
     */
    @Test
    public void testFindById_UserExists() {
        // GIVEN
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // WHEN
        User foundUser = userService.findById(1L);

        // THEN
        assertNotNull(foundUser);
        assertEquals(user.getId(), foundUser.getId());
        assertEquals(user.getEmail(), foundUser.getEmail());
        verify(userRepository, times(1)).findById(1L);
    }

    /**
     * Test la recherche d'un utilisateur par ID quand l'utilisateur n'existe pas
     * Vérifie que :
     * - La méthode findById du repository est appelée avec le bon ID
     * - Null est retourné quand l'utilisateur n'existe pas
     */
    @Test
    public void testFindById_UserDoesNotExist() {
        // GIVEN
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // WHEN
        User foundUser = userService.findById(999L);

        // THEN
        assertNull(foundUser);
        verify(userRepository, times(1)).findById(999L);
    }
}