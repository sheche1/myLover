package com.myLover.lover.service;

import org.springframework.stereotype.Service;

import com.myLover.lover.model.AuthRequest;
import com.myLover.lover.model.AuthResponse;

@Service
public class AuthService {

    public AuthResponse authenticate(AuthRequest request) {
        if ("user@example.com".equals(request.getEmail()) && "password".equals(request.getPassword())) {
            String token = "mock-jwt-token"; 
            return new AuthResponse(token);
        } else {
            throw new RuntimeException("Credenciales incorrectas");
        }
    }
}
