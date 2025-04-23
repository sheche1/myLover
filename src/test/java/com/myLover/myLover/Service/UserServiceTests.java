package com.myLover.myLover.Service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.List;
import java.util.ArrayList;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.myLover.lover.model.User;
import com.myLover.lover.repository.UserRepository;
import com.myLover.lover.service.UserService;

class UserServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setEmail("test@mail.com");
        user.setPassword("raw");
        user.setNombre("A");
        user.setApellido("B");
        user.setNombrePareja("C");
        user.setApellidoPareja("D");
    }

    @Test
    void shouldRegisterUserSuccessfully() {
        when(userRepository.findByEmail("test@mail.com")).thenReturn(null);
        when(passwordEncoder.encode("raw")).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User saved = userService.registerUser(user);

        assertThat(saved.getPassword()).isEqualTo("hashed");
        verify(userRepository).save(saved);
    }

    @Test
    void shouldFailWhenEmailAlreadyExists() {
        when(userRepository.findByEmail("test@mail.com")).thenReturn(user);
        assertThatThrownBy(() -> userService.registerUser(user)).isInstanceOf(RuntimeException.class);
    }

    @Test
    void shouldUpdateStatus() {
        when(userRepository.findUserByEmail("test@mail.com")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        userService.updateUserStatus("test@mail.com","Disponible");

        assertThat(user.getStatus()).isEqualTo("Disponible");
    }

    @Test
    void shouldSendFriendRequest() {
        User receiver = new User();
        receiver.setEmail("receiver@mail.com");
        when(userRepository.findUserByEmail("test@mail.com")).thenReturn(Optional.of(user));
        when(userRepository.findUserByEmail("receiver@mail.com")).thenReturn(Optional.of(receiver));
        when(userRepository.save(receiver)).thenReturn(receiver);

        User updated = userService.sendFriendRequest("test@mail.com","receiver@mail.com");

        assertThat(updated.getFriendRequests()).containsExactly(user);
    }

    @Test
    void shouldAcceptFriendRequest() {
        User sender = new User();
        sender.setEmail("sender@mail.com");
        user.getFriendRequests().add(sender);
        user.setFriends(new ArrayList<>());
        sender.setFriends(new ArrayList<>());

        when(userRepository.findUserByEmail("test@mail.com")).thenReturn(Optional.of(user));
        when(userRepository.findUserByEmail("sender@mail.com")).thenReturn(Optional.of(sender));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User updated = userService.acceptFriendRequest("test@mail.com","sender@mail.com");

        assertThat(updated.getFriends()).containsExactly(sender);
        assertThat(sender.getFriends()).containsExactly(user);
        assertThat(updated.getFriendRequests()).isEmpty();
    }

    @Test
    void shouldRejectFriendRequest() {
        User sender = new User();
        sender.setEmail("sender@mail.com");
        user.getFriendRequests().add(sender);

        when(userRepository.findUserByEmail("test@mail.com")).thenReturn(Optional.of(user));
        when(userRepository.findUserByEmail("sender@mail.com")).thenReturn(Optional.of(sender));
        when(userRepository.save(user)).thenReturn(user);

        User updated = userService.rejectFriendRequest("test@mail.com","sender@mail.com");

        assertThat(updated.getFriendRequests()).isEmpty();
    }

    @Test
    void shouldFindUserByEmail() {
        when(userRepository.findByEmail("test@mail.com")).thenReturn(user);
        User found = userService.findUserByEmail("test@mail.com");
        assertThat(found).isSameAs(user);
    }

    @Test
    void shouldSaveUser() {
        when(userRepository.save(user)).thenReturn(user);
        User saved = userService.saveUser(user);
        assertThat(saved).isSameAs(user);
    }

    @Test
    void shouldFindAllUsers() {
        List<User> list = List.of(user);
        when(userRepository.findAll()).thenReturn(list);
        List<User> result = userService.findAll();
        assertThat(result).containsExactly(user);
    }

    @Test
    void shouldReturnStatusWhenUserExists() {
        user.setStatus("Ocupado");
        when(userRepository.findByEmail("test@mail.com")).thenReturn(user);
        String status = userService.getUserStatus("test@mail.com");
        assertThat(status).isEqualTo("Ocupado");
    }

    @Test
    void shouldReturnNullWhenUserNotFound() {
        when(userRepository.findByEmail("missing@mail.com")).thenReturn(null);
        String status = userService.getUserStatus("missing@mail.com");
        assertThat(status).isNull();
    }

}
