package com.myLover.lover.repository;

import com.myLover.lover.model.PrivateLetter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrivateLetterRepository extends JpaRepository<PrivateLetter, Long> {

    // Cartas recibidas por un usuario, ordenadas
    List<PrivateLetter> findByReceiverEmailOrderByCreatedAtDesc(String receiverEmail);

    // Cartas enviadas por un usuario, ordenadas
    List<PrivateLetter> findBySenderEmailOrderByCreatedAtDesc(String senderEmail);
}