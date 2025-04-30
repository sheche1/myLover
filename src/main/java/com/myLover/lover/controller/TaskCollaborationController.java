package com.myLover.lover.controller;

import com.myLover.lover.model.TaskCollaborationRequest;
import com.myLover.lover.model.User;
import com.myLover.lover.repository.TaskCollaborationRequestRepository;
import com.myLover.lover.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/task-collab")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TaskCollaborationController {

    private final TaskCollaborationRequestRepository collabRepo;
    private final UserRepository userRepo;

    public TaskCollaborationController(TaskCollaborationRequestRepository collabRepo, UserRepository userRepo) {
        this.collabRepo = collabRepo;
        this.userRepo = userRepo;
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendRequest(@RequestParam String receiverEmail, Principal p) {
        if (receiverEmail == null || receiverEmail.isBlank()) {
            return ResponseEntity.badRequest().body("Email destino vacío");
        }
    
        User sender = userRepo.findUserByEmail(p.getName()).orElseThrow();
        User receiver = userRepo.findUserByEmail(receiverEmail).orElseThrow();
    
        boolean exists = collabRepo.existsByRequesterAndReceiver(sender, receiver)
                       || collabRepo.existsByRequesterAndReceiver(receiver, sender);
    
        if (exists) {
            return ResponseEntity.badRequest().body("Ya existe una solicitud");
        }
    
        TaskCollaborationRequest req = new TaskCollaborationRequest();
        req.setRequester(sender);
        req.setReceiver(receiver);
        req.setAccepted(false);
        collabRepo.save(req);
        return ResponseEntity.ok("Solicitud enviada");
    }
    

    @PostMapping("/accept")
    public ResponseEntity<?> accept(@RequestParam Long requestId, Principal p) {
        TaskCollaborationRequest req = collabRepo.findById(requestId).orElseThrow();
        if (!req.getReceiver().getEmail().equals(p.getName())) {
            return ResponseEntity.status(403).build();
        }
        req.setAccepted(true);
        collabRepo.save(req);
        return ResponseEntity.ok("Solicitud aceptada");
    }

    @GetMapping("/pending")
    public List<TaskCollaborationRequest> pendingRequests(Principal p) {
        User user = userRepo.findUserByEmail(p.getName()).orElseThrow();
        return collabRepo.findByReceiverAndAcceptedFalse(user);
    }

    @GetMapping("/accepted")
    public List<User> acceptedCollaborators(Principal p) {
        User u = userRepo.findUserByEmail(p.getName()).orElseThrow();
        return collabRepo.findAll().stream()
                .filter(r -> r.isAccepted() &&
                        (r.getRequester().equals(u) || r.getReceiver().equals(u)))
                .map(r -> r.getRequester().equals(u) ? r.getReceiver() : r.getRequester())
                .distinct().toList();
    }
}
