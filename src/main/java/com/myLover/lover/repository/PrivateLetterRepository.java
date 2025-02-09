package com.myLover.lover.repository;

import com.myLover.lover.model.PrivateLetter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrivateLetterRepository extends JpaRepository<PrivateLetter, Long> {

 // Para listar las cartas que un usuario recibió
 List<PrivateLetter> findByReceiverEmailOrderByCreatedAtDesc(String receiverEmail);

 // (Opcional) para ver las cartas que un usuario envió
 List<PrivateLetter> findBySenderEmailOrderByCreatedAtDesc(String senderEmail);
}