package com.myLover.lover.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.myLover.lover.model.Goal;
import com.myLover.lover.model.User;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUser(User user);
}