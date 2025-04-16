package com.myLover.lover.controller;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.myLover.lover.model.MemoryLocation;
import com.myLover.lover.model.User;
import com.myLover.lover.repository.MemoryLocationRepository;
import com.myLover.lover.repository.UserRepository;
import com.myLover.lover.service.FileStorageService;

@RestController
@RequestMapping("/api/memory-locations")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MemoryLocationController {

    @Autowired
    private MemoryLocationRepository memoryLocationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired                   
    private FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<?> getUserMemoryLocations(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Usuario no autenticado");
        }
        String email = principal.getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }

        List<MemoryLocation> locations = memoryLocationRepository.findByUser(user);
        return ResponseEntity.ok(locations);
    }


    @PostMapping
    public ResponseEntity<?> createMemoryLocation(@RequestBody MemoryLocation location, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Usuario no autenticado");
        }
        String email = principal.getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }

        location.setUser(user);
        MemoryLocation saved = memoryLocationRepository.save(location);
        return ResponseEntity.ok(saved);
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateMemoryLocation(@PathVariable Long id,
                                                  @RequestBody MemoryLocation updated,
                                                  Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Usuario no autenticado");
        }
        String email = principal.getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }
    
        return memoryLocationRepository.findById(id).map(loc -> {
            if (!loc.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("No autorizado");
            }
    
            loc.setTitle(updated.getTitle());
            loc.setDescription(updated.getDescription());
            loc.setDateVisited(updated.getDateVisited());
    
            if (updated.getLatitude() != null) {
                loc.setLatitude(updated.getLatitude());
            }
            if (updated.getLongitude() != null) {
                loc.setLongitude(updated.getLongitude());
            }
    
            memoryLocationRepository.save(loc);
            return ResponseEntity.ok(loc);  
        }).orElse(ResponseEntity.status(404).body("Lugar no encontrado"));
    }
    

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMemoryLocation(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Usuario no autenticado");
        }
        String email = principal.getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }

        return memoryLocationRepository.findById(id).map(loc -> {
            if (!loc.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("No autorizado");
            }
            memoryLocationRepository.delete(loc);
            return ResponseEntity.ok("Lugar eliminado");
        }).orElse(ResponseEntity.status(404).body("Lugar no encontrado"));
    }

    @PostMapping("/{id}/photo")
    public ResponseEntity<?> uploadPhoto(@PathVariable Long id,
                                     @RequestParam("file") MultipartFile file,
                                     Principal principal) throws IOException {

    if (principal == null) return ResponseEntity.status(401).body("No autenticado");
    User user = userRepository.findByEmail(principal.getName());
    if (user == null) return ResponseEntity.status(404).body("Usuario no encontrado");

    MemoryLocation loc = memoryLocationRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Lugar no encontrado"));
    if (!loc.getUser().getId().equals(user.getId()))
        return ResponseEntity.status(403).body("No autorizado");

    String filename = fileStorageService.store(file);  
    loc.setPhotoUrl("/uploads/" + filename);
    memoryLocationRepository.save(loc);
    return ResponseEntity.ok(loc);
}

}
