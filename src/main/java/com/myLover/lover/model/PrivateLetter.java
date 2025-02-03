package com.myLover.lover.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class PrivateLetter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderEmail;    // quien la envía
    private String receiverEmail;  // quien la recibe
    private String title;          // título/asunto
    private String content;        // cuerpo de la carta
    private LocalDateTime createdAt; // fecha/hora

    public PrivateLetter() {}

    public Long getId() {
        return id;
    }
    public void setId(Long id) { this.id = id; }

    public String getSenderEmail() {
        return senderEmail;
    }
    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public String getReceiverEmail() {
        return receiverEmail;
    }
    public void setReceiverEmail(String receiverEmail) {
        this.receiverEmail = receiverEmail;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}