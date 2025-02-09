package com.myLover.lover.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class PrivateLetter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderEmail;
    private String receiverEmail;
    private String title;

    @Column(length = 10000)
    private String content;

    private LocalDateTime createdAt;

    private LocalDate  unlockDate;


    private String secretPassword;

    // ----- getters y setters -----
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDate  getUnlockDate() {
        return unlockDate;
    }
    public void setUnlockDate(LocalDate  unlockDate) {
        this.unlockDate = unlockDate;
    }

    public String getSecretPassword() {
        return secretPassword;
    }
    public void setSecretPassword(String secretPassword) {
        this.secretPassword = secretPassword;
    }
}