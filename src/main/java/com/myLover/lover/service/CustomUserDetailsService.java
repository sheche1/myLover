package com.myLover.lover.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import com.myLover.lover.model.User;
import com.myLover.lover.repository.UserRepository;

/**
 * Para que Spring Security valide las credenciales con nuestra tabla "user".
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("Usuario no encontrado");
        }
        // Retornamos un UserDetails que contenga el email como username y la password encriptada
        return org.springframework.security.core.userdetails.User
            .withUsername(user.getEmail())
            .password(user.getPassword())  // la contraseña hasheada de la BD
            .roles("USER")                // o authorities si prefieres
            .build();
    }
}
