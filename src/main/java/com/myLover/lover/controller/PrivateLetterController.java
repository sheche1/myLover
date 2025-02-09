package com.myLover.lover.controller;

import com.myLover.lover.model.PrivateLetter;
import com.myLover.lover.repository.PrivateLetterRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/letters")
public class PrivateLetterController {

    private final PrivateLetterRepository letterRepository;

    public PrivateLetterController(PrivateLetterRepository letterRepository) {
        this.letterRepository = letterRepository;
    }

    @PostMapping
    public ResponseEntity<?> sendLetter(@RequestBody PrivateLetter incoming) {
        if (incoming.getSenderEmail() == null || incoming.getReceiverEmail() == null) {
            return ResponseEntity.badRequest().body("Falta senderEmail o receiverEmail");
        }
        incoming.setCreatedAt(LocalDateTime.now());

        PrivateLetter saved = letterRepository.save(incoming);
        return ResponseEntity.ok(saved);
    }


    @GetMapping
    public ResponseEntity<List<PrivateLetter>> getReceivedLetters(
        @RequestParam String receiverEmail
    ) {
        List<PrivateLetter> letters =
            letterRepository.findByReceiverEmailOrderByCreatedAtDesc(receiverEmail);
        return ResponseEntity.ok(letters);
    }

    @GetMapping("/sent")
    public ResponseEntity<List<PrivateLetter>> getSentLetters(
        @RequestParam String senderEmail
    ) {
        List<PrivateLetter> letters =
            letterRepository.findBySenderEmailOrderByCreatedAtDesc(senderEmail);
        return ResponseEntity.ok(letters);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLetter(@PathVariable Long id) {
    Optional<PrivateLetter> letterOpt = letterRepository.findById(id);
    if (letterOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                             .body("Carta no encontrada");
    }

    letterRepository.deleteById(id);
    return ResponseEntity.ok("Carta eliminada con éxito");
}

}