package com.myLover.lover.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.myLover.lover.model.User;
import com.myLover.lover.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository,PasswordEncoder passwordEncoder){
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public User findUserByEmail(String emial){
        return repository.findByEmail(emial);
    }

    public User saveUser(User user){
        return repository.save(user);
    }

    public User registerUser(User user){
        if (repository.findByEmail(user.getEmail()) != null){
            throw new RuntimeException("El correo ya está registrado"); 
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return repository.save(user);
    }
}
