package com.myLover.lover.controller;

import com.myLover.lover.model.PrivateLetter;
import com.myLover.lover.repository.PrivateLetterRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/letters")
public class PrivateLetterController {

    private final PrivateLetterRepository letterRepository;

    public PrivateLetterController(PrivateLetterRepository letterRepository) {
        this.letterRepository = letterRepository;
    }

    // 1) Enviar carta (POST)
    @PostMapping
    public ResponseEntity<?> sendLetter(@RequestBody PrivateLetter incoming) {
        if (incoming.getSenderEmail() == null || incoming.getReceiverEmail() == null) {
            return ResponseEntity.badRequest().body("Falta senderEmail o receiverEmail");
        }
        incoming.setCreatedAt(LocalDateTime.now());
        PrivateLetter saved = letterRepository.save(incoming);
        return ResponseEntity.ok(saved);
    }

    // 2) Listar cartas recibida
    @GetMapping
    public ResponseEntity<List<PrivateLetter>> getReceivedLetters(@RequestParam String receiverEmail) {
        List<PrivateLetter> letters = letterRepository.findByReceiverEmailOrderByCreatedAtDesc(receiverEmail);
        return ResponseEntity.ok(letters);
    }

    // Listar cartas enviadas
    @GetMapping("/sent")
    public ResponseEntity<List<PrivateLetter>> getSentLetters(@RequestParam String senderEmail) {
        List<PrivateLetter> letters = letterRepository.findBySenderEmailOrderByCreatedAtDesc(senderEmail);
        return ResponseEntity.ok(letters);
    }
}