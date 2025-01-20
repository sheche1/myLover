package com.myLover.lover.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.myLover.lover.model.AuthRequest;
import com.myLover.lover.model.AuthResponse;
import com.myLover.lover.model.User;

@Service
public class AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse authenticate(AuthRequest request) {
        User user = userService.findUserByEmail(request.getEmail());
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Credenciales incorrectas");
        }
        return new AuthResponse("mock-jwt-token");
    }
}

