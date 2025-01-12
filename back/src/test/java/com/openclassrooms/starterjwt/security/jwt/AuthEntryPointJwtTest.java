package com.openclassrooms.starterjwt.security.jwt;

import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.io.ByteArrayOutputStream;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;

import com.fasterxml.jackson.databind.ObjectMapper;

class AuthEntryPointJwtTest {

    private AuthEntryPointJwt authEntryPointJwt;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private AuthenticationException authException;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        authEntryPointJwt = new AuthEntryPointJwt();
    }

    @Test
    void testCommence() throws IOException, ServletException {
        // Arrange
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        when(response.getOutputStream()).thenReturn(new ServletOutputStreamWrapper(outputStream));
        when(request.getServletPath()).thenReturn("/api/test");
        when(authException.getMessage()).thenReturn("Unauthorized");

        // Act
        authEntryPointJwt.commence(request, response, authException);

        // Assert
        verify(response).setContentType(MediaType.APPLICATION_JSON_VALUE);
        verify(response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        verify(request).getServletPath();
        verify(authException, times(2)).getMessage();

        // Verify JSON response
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> expectedBody = new LinkedHashMap<>();
        expectedBody.put("path", "/api/test");
        expectedBody.put("error", "Unauthorized");
        expectedBody.put("message", "Unauthorized");
        expectedBody.put("status", HttpServletResponse.SC_UNAUTHORIZED);

        String expectedJson = mapper.writeValueAsString(expectedBody);
        String actualJson = outputStream.toString();
        assertThat(actualJson).isEqualToIgnoringWhitespace(expectedJson);
    }
}