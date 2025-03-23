package com.myLover.lover.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myLover.lover.model.EventoImportante;
import com.myLover.lover.model.User;
import com.myLover.lover.repository.EventoImportanteRepository;
import com.myLover.lover.repository.UserRepository;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class EventoImportanteController {

    @Autowired
    private EventoImportanteRepository eventoRepo;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<EventoImportante> getEventos(Principal principal) {
        User user = userRepository.findUserByEmail(principal.getName()).orElseThrow();
        return eventoRepo.findByUser(user);
    }

    @PostMapping
    public ResponseEntity<?> crearEvento(@RequestBody EventoImportante evento, Principal principal) {
        User user = userRepository.findUserByEmail(principal.getName()).orElseThrow();
        evento.setUser(user);
        eventoRepo.save(evento);
        return ResponseEntity.ok("Evento guardado");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editarEvento(@PathVariable Long id, @RequestBody EventoImportante updated) {
        return eventoRepo.findById(id).map(evento -> {
            evento.setTitulo(updated.getTitulo());
            evento.setDescripcion(updated.getDescripcion());
            evento.setFecha(updated.getFecha());
            eventoRepo.save(evento);
            return ResponseEntity.ok("Evento actualizado");
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarEvento(@PathVariable Long id) {
        return eventoRepo.findById(id).map(evento -> {
            eventoRepo.delete(evento);
            return ResponseEntity.ok("Evento eliminado");
        }).orElse(ResponseEntity.notFound().build());
    }
}

