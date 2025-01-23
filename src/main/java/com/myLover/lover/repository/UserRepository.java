package com.myLover.lover.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.myLover.lover.model.User;

public interface UserRepository extends JpaRepository<User,Long>{
    User findByEmail(String email);
    Optional<User> findUserByEmail(String email);
}
