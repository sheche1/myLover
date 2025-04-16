package com.myLover.lover.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.myLover.lover.model.MemoryLocation;
import com.myLover.lover.model.User;

public interface MemoryLocationRepository extends JpaRepository<MemoryLocation, Long> {
    List<MemoryLocation> findByUser(User user);
}
