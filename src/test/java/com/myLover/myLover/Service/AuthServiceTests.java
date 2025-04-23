package com.myLover.myLover.Service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.myLover.lover.model.*;
import com.myLover.lover.service.AuthService;
import com.myLover.lover.service.UserService;

class AuthServiceTests {

    @Mock
    private UserService userService;
    @Mock
    private PasswordEncoder encoder;
    @InjectMocks
    private AuthService authService;

    private AuthRequest request;
    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        request = new AuthRequest();
        request.setEmail("a@mail.com");
        request.setPassword("raw");
        user = new User();
        user.setEmail("a@mail.com");
        user.setPassword("hashed");
    }

    @Test
    void authenticateOk() {
        when(userService.findUserByEmail("a@mail.com")).thenReturn(user);
        when(encoder.matches("raw","hashed")).thenReturn(true);
        AuthResponse res = authService.authenticate(request);
        assertThat(res.getToken()).isNotBlank();
    }

    @Test
    void authenticateWrongPassword() {
        when(userService.findUserByEmail("a@mail.com")).thenReturn(user);
        when(encoder.matches("raw","hashed")).thenReturn(false);
        assertThatThrownBy(() -> authService.authenticate(request)).isInstanceOf(RuntimeException.class);
    }

    @Test
    void authenticateUserNotFound() {
        when(userService.findUserByEmail("a@mail.com")).thenReturn(null);
        assertThatThrownBy(() -> authService.authenticate(request)).isInstanceOf(RuntimeException.class);
    }
}