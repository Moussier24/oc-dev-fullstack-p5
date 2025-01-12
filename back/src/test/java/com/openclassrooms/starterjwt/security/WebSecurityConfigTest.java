package com.openclassrooms.starterjwt.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.userdetails.DaoAuthenticationConfigurer;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.openclassrooms.starterjwt.security.jwt.AuthEntryPointJwt;
import com.openclassrooms.starterjwt.security.jwt.AuthTokenFilter;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;

@SpringBootTest
class WebSecurityConfigTest {

    @Autowired
    private WebSecurityConfig webSecurityConfig;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @MockBean
    private AuthEntryPointJwt unauthorizedHandler;

    @Test
    void testAuthenticationJwtTokenFilter() {
        // Act
        AuthTokenFilter filter = webSecurityConfig.authenticationJwtTokenFilter();

        // Assert
        assertThat(filter).isNotNull();
    }

    @Test
    void testPasswordEncoder() {
        // Act
        PasswordEncoder encoder = webSecurityConfig.passwordEncoder();

        // Assert
        assertThat(encoder).isNotNull();
        assertThat(encoder).isInstanceOf(BCryptPasswordEncoder.class);
    }

    @Test
    void testAuthenticationManagerBean() throws Exception {
        // Act
        AuthenticationManager authManager = webSecurityConfig.authenticationManagerBean();

        // Assert
        assertThat(authManager).isNotNull();
    }

    @Test
    void testConfigure_AuthenticationManagerBuilder() throws Exception {
        // Arrange
        AuthenticationManagerBuilder authManagerBuilder = mock(AuthenticationManagerBuilder.class);
        DaoAuthenticationConfigurer<AuthenticationManagerBuilder, UserDetailsServiceImpl> daoConfigurer = mock(
                DaoAuthenticationConfigurer.class);
        when(authManagerBuilder.userDetailsService(userDetailsService)).thenReturn(daoConfigurer);
        when(daoConfigurer.passwordEncoder(any(PasswordEncoder.class))).thenReturn(daoConfigurer);

        // Act
        webSecurityConfig.configure(authManagerBuilder);

        // Assert
        verify(authManagerBuilder).userDetailsService(userDetailsService);
        verify(daoConfigurer).passwordEncoder(any(PasswordEncoder.class));
    }
}