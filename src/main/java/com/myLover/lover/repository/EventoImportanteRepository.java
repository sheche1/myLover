package com.myLover.lover.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.myLover.lover.model.EventoImportante;
import com.myLover.lover.model.User;

public interface EventoImportanteRepository extends JpaRepository<EventoImportante, Long> {
    List<EventoImportante> findByUser(User user);
}
