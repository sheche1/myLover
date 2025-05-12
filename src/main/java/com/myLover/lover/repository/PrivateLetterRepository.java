package com.myLover.lover.repository;

import com.myLover.lover.model.PrivateLetter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrivateLetterRepository extends JpaRepository<PrivateLetter, Long> {

 List<PrivateLetter> findByReceiverEmailOrderByCreatedAtDesc(String receiverEmail);

 List<PrivateLetter> findBySenderEmailOrderByCreatedAtDesc(String senderEmail);
}