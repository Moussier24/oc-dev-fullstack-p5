package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.UnsupportedJwtException;

/**
 * Tests unitaires pour JwtUtils
 */
public class JwtUtilsTest {

    private JwtUtils jwtUtils;
    private Authentication authentication;
    private UserDetailsImpl userDetails;

    /**
     * Configuration initiale avant chaque test
     */
    @BeforeEach
    public void setup() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "bezKoderSecretKey");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 86400000);

        // Configuration des mocks
        authentication = mock(Authentication.class);
        userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("test@test.com")
                .firstName("John")
                .lastName("Doe")
                .password("encodedPassword")
                .build();
        when(authentication.getPrincipal()).thenReturn(userDetails);
    }

    /**
     * Test la génération d'un token JWT
     * Vérifie que le token est généré correctement et contient les bonnes
     * informations
     */
    @Test
    public void testGenerateJwtToken() {
        // WHEN
        String token = jwtUtils.generateJwtToken(authentication);

        // THEN
        assertNotNull(token);
        assertTrue(token.length() > 0);
        assertTrue(jwtUtils.validateJwtToken(token));
        assertEquals("test@test.com", jwtUtils.getUserNameFromJwtToken(token));
    }

    /**
     * Test l'extraction du nom d'utilisateur d'un token JWT valide
     * Vérifie que le nom d'utilisateur est correctement extrait
     */
    @Test
    public void testGetUserNameFromJwtToken() {
        // GIVEN
        String token = jwtUtils.generateJwtToken(authentication);

        // WHEN
        String username = jwtUtils.getUserNameFromJwtToken(token);

        // THEN
        assertEquals("test@test.com", username);
    }

    /**
     * Test la validation d'un token JWT valide
     * Vérifie que le token est considéré comme valide
     */
    @Test
    public void testValidateJwtToken_ValidToken() {
        // GIVEN
        String token = jwtUtils.generateJwtToken(authentication);

        // WHEN
        boolean isValid = jwtUtils.validateJwtToken(token);

        // THEN
        assertTrue(isValid);
    }

    /**
     * Test la validation d'un token JWT invalide
     * Vérifie que le token est considéré comme invalide
     */
    @Test
    public void testValidateJwtToken_InvalidToken() {
        // GIVEN
        String invalidToken = "invalid.token.here";

        // WHEN
        boolean isValid = jwtUtils.validateJwtToken(invalidToken);

        // THEN
        assertFalse(isValid);
    }

    /**
     * Test la validation d'un token JWT null
     * Vérifie que le token null est considéré comme invalide
     */
    @Test
    public void testValidateJwtToken_NullToken() {
        // WHEN
        boolean isValid = jwtUtils.validateJwtToken(null);

        // THEN
        assertFalse(isValid);
    }

    /**
     * Test la validation d'un token JWT vide
     * Vérifie que le token vide est considéré comme invalide
     */
    @Test
    public void testValidateJwtToken_EmptyToken() {
        // WHEN
        boolean isValid = jwtUtils.validateJwtToken("");

        // THEN
        assertFalse(isValid);
    }

    /**
     * Test la validation d'un token JWT avec une signature invalide
     */
    @Test
    public void testValidateJwtToken_InvalidSignature() {
        // GIVEN
        String token = jwtUtils.generateJwtToken(authentication);
        String invalidSignatureToken = token.substring(0, token.length() - 5) + "12345"; // Modifie la signature

        // WHEN
        boolean isValid = jwtUtils.validateJwtToken(invalidSignatureToken);

        // THEN
        assertFalse(isValid);
    }

    /**
     * Test la validation d'un token JWT malformé
     */
    @Test
    public void testValidateJwtToken_MalformedToken() {
        // GIVEN
        String malformedToken = "eyJhbGciOiJIUzI1NiJ9.malformed.token";

        // WHEN
        boolean isValid = jwtUtils.validateJwtToken(malformedToken);

        // THEN
        assertFalse(isValid);
    }

    /**
     * Test la validation d'un token JWT expiré
     */
    @Test
    public void testValidateJwtToken_ExpiredToken() {
        // GIVEN
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "bezKoderSecretKey");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 0); // Token expire immédiatement
        String expiredToken = jwtUtils.generateJwtToken(authentication);

        // WHEN
        boolean isValid = jwtUtils.validateJwtToken(expiredToken);

        // THEN
        assertFalse(isValid);
    }

    /**
     * Test la validation d'un token JWT non supporté
     */
    @Test
    public void testValidateJwtToken_UnsupportedToken() {
        // GIVEN
        String unsupportedToken = "unsupported.token.format";

        // WHEN
        boolean isValid = jwtUtils.validateJwtToken(unsupportedToken);

        // THEN
        assertFalse(isValid);
    }
}