package com.myLover.lover.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.myLover.lover.model.User;

public interface UserRepository extends JpaRepository<User,Long>{
    User findByEmail(String email);
    Optional<User> findUserByEmail(String email);

    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.email = :email")
    void updateEstado(@Param("email") String email, @Param("status") String status);

}
