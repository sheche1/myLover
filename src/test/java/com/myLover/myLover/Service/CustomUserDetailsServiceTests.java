package com.myLover.myLover.Service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetails;

import com.myLover.lover.model.User;
import com.myLover.lover.repository.UserRepository;
import com.myLover.lover.service.CustomUserDetailsService;

class CustomUserDetailsServiceTests {

    @Mock
    private UserRepository repo;
    @InjectMocks
    private CustomUserDetailsService service;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setEmail("b@mail.com");
        user.setPassword("hash");
    }

    @Test
    void loadUserOk() {
        when(repo.findByEmail("b@mail.com")).thenReturn(user);
        UserDetails details = service.loadUserByUsername("b@mail.com");
        assertThat(details.getUsername()).isEqualTo("b@mail.com");
        assertThat(details.getPassword()).isEqualTo("hash");
    }

    @Test
    void loadUserNotFound() {
        when(repo.findByEmail("b@mail.com")).thenReturn(null);
        assertThatThrownBy(() -> service.loadUserByUsername("b@mail.com"))
            .isInstanceOf(UsernameNotFoundException.class);
    }
}
