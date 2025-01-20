package com.myLover.lover.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import com.myLover.lover.model.User;
import com.myLover.lover.service.UserService;

@RestController
@RequestMapping("/api")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    // GET: retorna el perfil del usuario logueado
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("No estás autenticado.");
        }
        String email = auth.getName();
        User user = userService.findUserByEmail(email);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    // PUT: actualiza campos del usuario logueado
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
        Authentication auth,
        @RequestBody User updatedData
    ) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("No estás autenticado.");
        }
        String email = auth.getName();
        User user = userService.findUserByEmail(email);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // Actualizamos los campos. (No cambiamos email ni password si no quieres)
        user.setNombre(updatedData.getNombre());
        user.setApellido(updatedData.getApellido());
        user.setNombrePareja(updatedData.getNombrePareja());
        user.setApellidoPareja(updatedData.getApellidoPareja());
        user.setFechaNacimiento(updatedData.getFechaNacimiento());
        user.setFechaNacimientoPareja(updatedData.getFechaNacimientoPareja());
        user.setFechaPrimerEncuentro(updatedData.getFechaPrimerEncuentro());

        // Guardamos
        User saved = userService.saveUser(user);
        return ResponseEntity.ok(saved);
    }
}
