package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests unitaires pour AuthController
 */
@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

        @Mock
        private AuthenticationManager authenticationManager;

        @Mock
        private UserRepository userRepository;

        @Mock
        private PasswordEncoder passwordEncoder;

        @Mock
        private JwtUtils jwtUtils;

        @Mock
        private Authentication authentication;

        @InjectMocks
        private AuthController authController;

        private LoginRequest loginRequest;
        private SignupRequest signupRequest;
        private User user;
        private UserDetailsImpl userDetails;

        /**
         * Configuration initiale avant chaque test
         */
        @BeforeEach
        public void setup() {
                // Configuration de la requête de login
                loginRequest = new LoginRequest();
                loginRequest.setEmail("test@test.com");
                loginRequest.setPassword("password");

                // Configuration de la requête d'inscription
                signupRequest = new SignupRequest();
                signupRequest.setEmail("test@test.com");
                signupRequest.setFirstName("John");
                signupRequest.setLastName("Doe");
                signupRequest.setPassword("password");

                // Configuration de l'utilisateur
                user = new User();
                user.setId(1L);
                user.setEmail("test@test.com");
                user.setFirstName("John");
                user.setLastName("Doe");
                user.setPassword("encodedPassword");
                user.setAdmin(false);

                // Configuration des détails utilisateur
                userDetails = UserDetailsImpl.builder()
                                .id(1L)
                                .username("test@test.com")
                                .firstName("John")
                                .lastName("Doe")
                                .password("encodedPassword")
                                .build();
        }

        /**
         * Test l'authentification réussie d'un utilisateur
         * Vérifie que la réponse contient un token JWT et les informations utilisateur
         */
        @Test
        public void testLogin_Success() {
                // GIVEN
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                loginRequest.getEmail(), loginRequest.getPassword());
                when(authenticationManager.authenticate(eq(authToken))).thenReturn(authentication);
                when(authentication.getPrincipal()).thenReturn(userDetails);
                when(jwtUtils.generateJwtToken(authentication)).thenReturn("jwt-token");
                when(userRepository.findByEmail(eq("test@test.com"))).thenReturn(Optional.of(user));

                // WHEN
                ResponseEntity<?> response = authController.authenticateUser(loginRequest);

                // THEN
                assertTrue(response.getBody() instanceof JwtResponse);
                JwtResponse jwtResponse = (JwtResponse) response.getBody();
                assertEquals("jwt-token", jwtResponse.getToken());
                assertEquals(1L, jwtResponse.getId());
                assertEquals("test@test.com", jwtResponse.getUsername());
                assertEquals("John", jwtResponse.getFirstName());
                assertEquals("Doe", jwtResponse.getLastName());
                assertFalse(jwtResponse.getAdmin());
        }

        /**
         * Test l'inscription réussie d'un utilisateur
         * Vérifie que la réponse contient un message de succès
         */
        @Test
        public void testRegister_Success() {
                // GIVEN
                when(userRepository.existsByEmail(eq("test@test.com"))).thenReturn(false);
                when(passwordEncoder.encode(eq("password"))).thenReturn("encodedPassword");

                // WHEN
                ResponseEntity<?> response = authController.registerUser(signupRequest);

                // THEN
                assertTrue(response.getBody() instanceof MessageResponse);
                MessageResponse messageResponse = (MessageResponse) response.getBody();
                assertEquals("User registered successfully!", messageResponse.getMessage());
                verify(userRepository, times(1)).save(any(User.class));
        }

        /**
         * Test l'inscription avec un email déjà utilisé
         * Vérifie que la réponse contient un message d'erreur
         */
        @Test
        public void testRegister_EmailTaken() {
                // GIVEN
                when(userRepository.existsByEmail(eq("test@test.com"))).thenReturn(true);

                // WHEN
                ResponseEntity<?> response = authController.registerUser(signupRequest);

                // THEN
                assertTrue(response.getBody() instanceof MessageResponse);
                MessageResponse messageResponse = (MessageResponse) response.getBody();
                assertEquals("Error: Email is already taken!", messageResponse.getMessage());
                verify(userRepository, never()).save(any(User.class));
        }
}