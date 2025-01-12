package com.openclassrooms.starterjwt.security.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests unitaires pour le service UserDetailsServiceImpl
 */
@ExtendWith(MockitoExtension.class)
public class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    private User user;
    private final String userEmail = "test@test.com";

    /**
     * Configuration initiale avant chaque test
     */
    @BeforeEach
    public void setup() {
        user = new User();
        user.setId(1L);
        user.setEmail(userEmail);
        user.setLastName("Doe");
        user.setFirstName("John");
        user.setPassword("password123");
        user.setAdmin(false);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
    }

    /**
     * Test le chargement d'un utilisateur par son email quand il existe
     * Vérifie que :
     * - La méthode findByEmail du repository est appelée avec le bon email
     * - Les détails de l'utilisateur sont correctement mappés
     * - Tous les champs sont correctement copiés dans UserDetails
     */
    @Test
    public void testLoadUserByUsername_UserExists() {
        // GIVEN
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));

        // WHEN
        UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

        // THEN
        assertNotNull(userDetails);
        assertEquals(user.getEmail(), userDetails.getUsername());
        assertEquals(user.getPassword(), userDetails.getPassword());

        // Vérification que c'est bien un UserDetailsImpl
        assertTrue(userDetails instanceof UserDetailsImpl);
        UserDetailsImpl userDetailsImpl = (UserDetailsImpl) userDetails;

        // Vérification des champs spécifiques à UserDetailsImpl
        assertEquals(user.getId(), userDetailsImpl.getId());
        assertEquals(user.getLastName(), userDetailsImpl.getLastName());
        assertEquals(user.getFirstName(), userDetailsImpl.getFirstName());

        verify(userRepository, times(1)).findByEmail(userEmail);
    }

    /**
     * Test le chargement d'un utilisateur par son email quand il n'existe pas
     * Vérifie que :
     * - La méthode findByEmail du repository est appelée avec le bon email
     * - Une exception UsernameNotFoundException est lancée avec le bon message
     */
    @Test
    public void testLoadUserByUsername_UserNotFound() {
        // GIVEN
        String nonExistentEmail = "nonexistent@test.com";
        when(userRepository.findByEmail(nonExistentEmail)).thenReturn(Optional.empty());

        // WHEN & THEN
        Exception exception = assertThrows(UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername(nonExistentEmail));

        // Vérification du message d'erreur
        String expectedMessage = "User Not Found with email: " + nonExistentEmail;
        String actualMessage = exception.getMessage();
        assertEquals(expectedMessage, actualMessage);

        verify(userRepository, times(1)).findByEmail(nonExistentEmail);
    }

    /**
     * Test le chargement d'un utilisateur avec un email null
     * Vérifie que :
     * - Une exception UsernameNotFoundException est lancée
     * - Le repository est appelé avec null
     */
    @Test
    public void testLoadUserByUsername_NullUsername() {
        // GIVEN
        when(userRepository.findByEmail(null)).thenReturn(Optional.empty());

        // WHEN & THEN
        Exception exception = assertThrows(UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername(null));

        // Vérification du message d'erreur
        String expectedMessage = "User Not Found with email: null";
        String actualMessage = exception.getMessage();
        assertEquals(expectedMessage, actualMessage);

        verify(userRepository, times(1)).findByEmail(null);
    }
}