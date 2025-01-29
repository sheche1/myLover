package com.myLover.lover.repository;

import com.myLover.lover.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m " +
           "WHERE (m.senderEmail = :user1 AND m.receiverEmail = :user2) " +
           "   OR (m.senderEmail = :user2 AND m.receiverEmail = :user1) " +
           "ORDER BY m.timestamp ASC")
    List<Message> findConversation(@Param("user1") String user1, @Param("user2") String user2);
}
