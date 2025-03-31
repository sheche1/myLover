package com.myLover.lover.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.myLover.lover.model.ImportantEvent;
import com.myLover.lover.model.User;
import com.myLover.lover.repository.ImportantEventRepository;
import com.myLover.lover.repository.UserRepository;

@RestController
@RequestMapping("/api/important-events")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ImportantEventController {

    @Autowired
    private ImportantEventRepository importantEventRepo;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<ImportantEvent> getUserEvents(Principal principal) {
    
        User user = userRepository.findUserByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return importantEventRepo.findByUser(user);
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody ImportantEvent event, Principal principal) {
        User user = userRepository.findUserByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        event.setUser(user);
        importantEventRepo.save(event);
        return ResponseEntity.ok("Event saved successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editEvent(@PathVariable Long id, @RequestBody ImportantEvent updated) {
        return importantEventRepo.findById(id).map(event -> {
            event.setTitle(updated.getTitle());
            event.setDescription(updated.getDescription());
            event.setDate(updated.getDate());
            importantEventRepo.save(event);
            return ResponseEntity.ok("Event updated");
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        return importantEventRepo.findById(id).map(event -> {
            importantEventRepo.delete(event);
            return ResponseEntity.ok("Event deleted");
        }).orElse(ResponseEntity.notFound().build());
    }
}
