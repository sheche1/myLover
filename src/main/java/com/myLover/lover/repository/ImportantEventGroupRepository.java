package com.myLover.lover.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.myLover.lover.model.ImportantEventGroup;
import com.myLover.lover.model.User;

public interface ImportantEventGroupRepository extends JpaRepository<ImportantEventGroup, Long> {
    List<ImportantEventGroup> findByUser(User user);

    @Query("SELECT g FROM ImportantEventGroup g LEFT JOIN FETCH g.events WHERE g.user = :user")
    List<ImportantEventGroup> findWithEventsByUser(@Param("user") User user);
    
}

