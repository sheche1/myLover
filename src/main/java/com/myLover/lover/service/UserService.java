package com.myLover.lover.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.myLover.lover.model.User;
import com.myLover.lover.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }


    public User findUserByEmail(String email){
        return repository.findByEmail(email);
    }

    public User saveUser(User user){
        return repository.save(user);
    }

    public List<User> findAll() {
        return repository.findAll();
    }
    
    public User registerUser(User user) {
        if (repository.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("El correo ya está registrado");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return repository.save(user);
    }

    public User sendFriendRequest(String senderEmail, String receiverEmail) {
        User sender = repository.findUserByEmail(senderEmail).orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = repository.findUserByEmail(receiverEmail).orElseThrow(() -> new RuntimeException("Receiver not found"));
        receiver.getFriendRequests().add(sender);
        return repository.save(receiver);
    }

    public User acceptFriendRequest(String receiverEmail, String senderEmail) {
        User receiver = repository.findUserByEmail(receiverEmail).orElseThrow(() -> new RuntimeException("Receiver not found"));
        User sender = repository.findUserByEmail(senderEmail).orElseThrow(() -> new RuntimeException("Sender not found"));
        receiver.getFriendRequests().remove(sender);
        receiver.getFriends().add(sender);
        sender.getFriends().add(receiver);
        repository.save(sender);
        return repository.save(receiver);
    }

    public User rejectFriendRequest(String receiverEmail, String senderEmail) {
        User receiver = repository.findUserByEmail(receiverEmail).orElseThrow(() -> new RuntimeException("Receiver not found"));
        User sender = repository.findUserByEmail(senderEmail).orElseThrow(() -> new RuntimeException("Sender not found"));
        receiver.getFriendRequests().remove(sender);
        return repository.save(receiver);
    }
}
