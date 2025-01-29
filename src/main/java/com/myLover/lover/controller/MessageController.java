package com.myLover.lover.controller;

import com.myLover.lover.model.Message;
import com.myLover.lover.repository.MessageRepository;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageRepository messageRepository;

    public MessageController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @PostMapping
    public Message saveMessage(@RequestBody Message incoming) {
        incoming.setTimestamp(LocalDateTime.now()); 
        return messageRepository.save(incoming);
    }

    @GetMapping
    public List<Message> getConversation(
            @RequestParam String user1,
            @RequestParam String user2) {
        return messageRepository.findConversation(user1, user2);
    }
}