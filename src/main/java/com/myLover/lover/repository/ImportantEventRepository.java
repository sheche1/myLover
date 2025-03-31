package com.myLover.lover.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.myLover.lover.model.ImportantEvent;
import com.myLover.lover.model.User;

public interface ImportantEventRepository extends JpaRepository<ImportantEvent, Long> {
    List<ImportantEvent> findByUser(User user);
}
