package com.myLover.lover.controller;

import com.myLover.lover.model.SharedTask;
import com.myLover.lover.model.User;
import com.myLover.lover.repository.TaskCollaborationRequestRepository;
import com.myLover.lover.repository.UserRepository;
import com.myLover.lover.service.SharedTaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SharedTaskController {

    private final SharedTaskService service;
    private final UserRepository userRepo;
    private final TaskCollaborationRequestRepository collabRepo;

    public SharedTaskController(SharedTaskService service, UserRepository userRepo, TaskCollaborationRequestRepository collabRepo) {
        this.service = service;
        this.userRepo = userRepo;
        this.collabRepo = collabRepo;
    }

    @GetMapping
    public List<SharedTask> list(Principal p) {
        User u = userRepo.findUserByEmail(p.getName()).orElseThrow();
        return service.listFor(u);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody SharedTask t, Principal p) {
        User creator = userRepo.findUserByEmail(p.getName()).orElseThrow();
        User assigned = userRepo.findUserByEmail(t.getAssignedTo().getEmail()).orElseThrow();
        t.setCreatedBy(creator);
        t.setAssignedTo(assigned);
        return ResponseEntity.ok(service.create(t));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody SharedTask t) {
        User assigned = userRepo.findUserByEmail(t.getAssignedTo().getEmail()).orElseThrow();
        t.setAssignedTo(assigned);
        return ResponseEntity.ok(service.update(id, t));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("ok");
    }
}
