package com.myLover.lover.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.myLover.lover.model.Photo;
import com.myLover.lover.model.User;
import com.myLover.lover.repository.PhotoRepository;
import com.myLover.lover.repository.UserRepository;
import com.myLover.lover.service.FileStorageService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/photos")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PhotoController {

    @Autowired
    private PhotoRepository photoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<List<Photo>> getUserPhotos(Principal principal) {
        String email = principal.getName();
        User user = userRepository.findUserByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    
        List<Photo> photos = photoRepository.findAllByUser(user);
        return ResponseEntity.ok(photos);
    }
    
    @PostMapping("/upload")
    public ResponseEntity<String> uploadPhoto(@RequestParam("file") MultipartFile file,
                                              @RequestParam("category") String category,
                                              @RequestParam("description") String description,
                                              Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");
            }
    
            String email = principal.getName();
            User user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El archivo está vacío");
            }
    
            String filename = fileStorageService.store(file);
            String fileUrl = "http://localhost:8080/uploads/" + filename;
    
            Photo photo = new Photo();
            photo.setUrl(fileUrl);
            photo.setCategory(category);
            photo.setDescription(description);
            photo.setUser(user); 
            photoRepository.save(photo);
    
            return ResponseEntity.ok("Imagen subida con éxito: " + filename);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error al subir la imagen: " + e.getMessage());
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Photo>> getPhotosByCategory(@PathVariable String category, Principal principal) {
    if (principal == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    String email = principal.getName();
    User user = userRepository.findUserByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    List<Photo> photos = photoRepository.findAllByUserAndCategory(user, category);
    return ResponseEntity.ok(photos);
}

@DeleteMapping("/{id}")
public ResponseEntity<String> deletePhoto(@PathVariable Long id, Principal principal) {
    if (principal == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
    }

    String email = principal.getName();
    User user = userRepository.findUserByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    return photoRepository.findById(id).map(photo -> {
        if (!photo.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permiso para eliminar esta foto");
        }

        photoRepository.delete(photo);
        return ResponseEntity.ok("Foto eliminada con éxito");
    }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Foto no encontrada"));
}


}
