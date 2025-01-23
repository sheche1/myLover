package com.myLover.lover.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import com.myLover.lover.model.User;
import com.myLover.lover.repository.UserRepository;
import com.myLover.lover.service.UserService;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/friends")
public class FriendController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/send")
    public ResponseEntity<String> sendFriendRequest(@RequestParam String senderEmail, @RequestParam String receiverEmail) {
        try {
            if (senderEmail == null || receiverEmail == null || senderEmail.isEmpty() || receiverEmail.isEmpty()) {
                return ResponseEntity.badRequest().body("Faltan parámetros");
            }
    
            System.out.println("Enviando solicitud de: " + senderEmail + " a " + receiverEmail);
    
            Optional<User> senderOpt = userRepository.findUserByEmail(senderEmail);
            Optional<User> receiverOpt = userRepository.findUserByEmail(receiverEmail);
    
            if (senderOpt.isEmpty() || receiverOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
            }
    
            User sender = senderOpt.get();
            User receiver = receiverOpt.get();
    
            if (receiver.getFriendRequests().contains(sender)) {
                return ResponseEntity.badRequest().body("La solicitud ya fue enviada anteriormente");
            }
    
            receiver.getFriendRequests().add(sender);
            userRepository.save(receiver);
    
            return ResponseEntity.ok("Solicitud enviada con éxito");
    
        } catch (Exception e) {
            System.err.println("Error al enviar solicitud: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en el servidor: " + e.getMessage());
        }
    }
    
    @PostMapping("/accept")
    public ResponseEntity<?> acceptFriendRequest(@RequestParam String receiverEmail, @RequestParam String senderEmail, Principal principal) {
        if (!principal.getName().equals(receiverEmail)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Acceso no autorizado");
        }
    
        Optional<User> receiverOpt = userRepository.findUserByEmail(receiverEmail);
        Optional<User> senderOpt = userRepository.findUserByEmail(senderEmail);
    
        if (receiverOpt.isEmpty() || senderOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    
        User receiver = receiverOpt.get();
        User sender = senderOpt.get();
    
        receiver.getFriendRequests().remove(sender);
        receiver.getFriends().add(sender);
        sender.getFriends().add(receiver);
    
        userRepository.save(receiver);
        userRepository.save(sender);
    
        return ResponseEntity.ok(Map.of("message", "Solicitud de amistad aceptada", "friends", receiver.getFriends()));
    }
    
@PostMapping("/reject")
public ResponseEntity<String> rejectFriendRequest(@RequestParam String receiverEmail, @RequestParam String senderEmail, Principal principal) {
    if (!principal.getName().equals(receiverEmail)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Acceso no autorizado");
    }

    Optional<User> receiverOpt = userRepository.findUserByEmail(receiverEmail);
    Optional<User> senderOpt = userRepository.findUserByEmail(senderEmail);

    if (receiverOpt.isEmpty() || senderOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
    }

    User receiver = receiverOpt.get();
    User sender = senderOpt.get();

    receiver.getFriendRequests().remove(sender);
    userRepository.save(receiver);

    return ResponseEntity.ok("Solicitud rechazada exitosamente");
}




@GetMapping("/list")
public ResponseEntity<?> getFriends(@RequestParam String email) {
    Optional<User> userOpt = userRepository.findUserByEmail(email);
    if (userOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
    }

    User user = userOpt.get();
    List<User> friends = user.getFriends();
    return ResponseEntity.ok(friends);
}
 
}
