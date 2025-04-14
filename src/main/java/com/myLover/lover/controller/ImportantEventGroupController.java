package com.myLover.lover.controller;

import java.io.IOException;
import java.nio.file.*;
import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.myLover.lover.model.ImportantEvent;
import com.myLover.lover.model.ImportantEventGroup;
import com.myLover.lover.model.User;
import com.myLover.lover.repository.ImportantEventGroupRepository;
import com.myLover.lover.repository.ImportantEventRepository;
import com.myLover.lover.repository.UserRepository;

@RestController
@RequestMapping("/api/event-groups")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ImportantEventGroupController {

    @Autowired
    private ImportantEventGroupRepository groupRepo;

    @Autowired
    private ImportantEventRepository eventRepo;

    @Autowired
    private UserRepository userRepo;

    private final String uploadDir = "uploads/";

    @GetMapping
    public List<ImportantEventGroup> getGroups(Principal principal) {
        User user = userRepo.findUserByEmail(principal.getName()).orElseThrow();
        return groupRepo.findWithEventsByUser(user);
    }

    @PostMapping
    public ResponseEntity<?> createGroup(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(value = "eventIds", required = false) List<Long> eventIds,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            Principal principal
    ) throws IOException {

        User user = userRepo.findUserByEmail(principal.getName()).orElseThrow();

        ImportantEventGroup group = new ImportantEventGroup();
        group.setTitle(title);
        group.setDescription(description);
        group.setUser(user);

        if (photo != null && !photo.isEmpty()) {
            Files.createDirectories(Paths.get(uploadDir));
            String filename = UUID.randomUUID() + "_" + photo.getOriginalFilename();
            Files.copy(photo.getInputStream(), Paths.get(uploadDir).resolve(filename),
                    StandardCopyOption.REPLACE_EXISTING);
            group.setPhotoUrl("/uploads/" + filename);
        }

        ImportantEventGroup savedGroup = groupRepo.save(group);

        if (eventIds != null) {
            for (Long id : eventIds) {
                Optional<ImportantEvent> opt = eventRepo.findById(id);
                if (opt.isPresent()) {
                    ImportantEvent ev = opt.get();
                    ev.setGroup(savedGroup);
                    eventRepo.save(ev);
                }
            }
        }

        ImportantEventGroup completeGroup = groupRepo.findWithEventsByUser(user).stream()
                .filter(g -> g.getId().equals(savedGroup.getId()))
                .findFirst()
                .orElse(savedGroup);

        return ResponseEntity.ok(completeGroup);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGroup(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(value = "eventIds", required = false) List<Long> eventIds,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            Principal principal
    ) throws IOException {

        User user = userRepo.findUserByEmail(principal.getName()).orElseThrow();
        ImportantEventGroup group = groupRepo.findById(id).orElseThrow();

        if (!group.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        group.setTitle(title);
        group.setDescription(description);

        if (photo != null && !photo.isEmpty()) {
            Files.createDirectories(Paths.get(uploadDir));
            String filename = UUID.randomUUID() + "_" + photo.getOriginalFilename();
            Files.copy(photo.getInputStream(), Paths.get(uploadDir).resolve(filename), StandardCopyOption.REPLACE_EXISTING);
            group.setPhotoUrl("/uploads/" + filename);
        }

        ImportantEventGroup savedGroup = groupRepo.save(group);

        if (eventIds != null) {
            for (ImportantEvent ev : eventRepo.findByGroup(savedGroup)) {
                ev.setGroup(null);
                eventRepo.save(ev);
            }
            for (Long eid : eventIds) {
                ImportantEvent ev = eventRepo.findById(eid).orElseThrow();
                ev.setGroup(savedGroup);
                eventRepo.save(ev);
            }
        }

        return ResponseEntity.ok(savedGroup);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroup(@PathVariable Long id, Principal principal) {
        User user = userRepo.findUserByEmail(principal.getName()).orElseThrow();
        ImportantEventGroup group = groupRepo.findById(id).orElseThrow();
        if (!group.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        for (ImportantEvent ev : eventRepo.findByGroup(group)) {
            ev.setGroup(null);
            eventRepo.save(ev);
        }
        groupRepo.delete(group);
        return ResponseEntity.ok().build();
    }
}