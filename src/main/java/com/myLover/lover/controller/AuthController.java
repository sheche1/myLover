package com.myLover.lover.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myLover.lover.model.AuthRequest;
import com.myLover.lover.model.AuthResponse;
import com.myLover.lover.model.User;
import com.myLover.lover.service.AuthService;
import com.myLover.lover.service.UserService;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService,UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return authService.authenticate(request);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user){
        try{
            User registeredUser  = userService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

}
