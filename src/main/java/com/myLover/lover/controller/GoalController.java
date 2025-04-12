package com.myLover.lover.controller;

import com.myLover.lover.model.Goal;
import com.myLover.lover.model.User;
import com.myLover.lover.repository.GoalRepository;
import com.myLover.lover.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class GoalController {

    @Autowired private GoalRepository goalRepo;
    @Autowired private UserRepository userRepo;

    @GetMapping
    public List<Goal> getGoals(Principal principal) {
        User user = userRepo.findUserByEmail(principal.getName()).orElseThrow();
        return goalRepo.findByUser(user);
    }

    @PostMapping
    public ResponseEntity<?> createGoal(@RequestBody Goal goal, Principal principal) {
        User user = userRepo.findUserByEmail(principal.getName()).orElseThrow();
        goal.setUser(user);
        return ResponseEntity.ok(goalRepo.save(goal));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGoal(@PathVariable Long id, @RequestBody Goal updated) {
        return goalRepo.findById(id).map(goal -> {
            goal.setTitle(updated.getTitle());
            goal.setDescription(updated.getDescription());
            goal.setDeadline(updated.getDeadline());
            goal.setCompleted(updated.isCompleted());
            return ResponseEntity.ok(goalRepo.save(goal));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable Long id) {
        goalRepo.deleteById(id);
        return ResponseEntity.ok("Goal deleted");
    }
}
