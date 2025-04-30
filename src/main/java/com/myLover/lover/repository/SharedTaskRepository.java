package com.myLover.lover.repository;

import com.myLover.lover.model.SharedTask;
import com.myLover.lover.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SharedTaskRepository extends JpaRepository<SharedTask, Long> {
    List<SharedTask> findByCreatedByOrAssignedTo(User creator, User assignee);
    
}
