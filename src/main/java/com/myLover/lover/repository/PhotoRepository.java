package com.myLover.lover.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.myLover.lover.model.Photo;
import com.myLover.lover.model.User;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {

    List<Photo> findAllByCategory(String category);
    List<Photo> findAllByUser(User user);
    List<Photo> findAllByUserAndCategory(User user, String category);

}
