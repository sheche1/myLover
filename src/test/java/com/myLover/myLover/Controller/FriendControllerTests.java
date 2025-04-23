package com.myLover.myLover.Controller;

import com.myLover.lover.model.User;
import com.myLover.lover.repository.UserRepository;
import com.myLover.myLover.TestSecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class)
class FriendControllerTests {

    @Autowired private MockMvc mvc;

    @MockBean private UserRepository userRepository;

    @Test
    void sendRequestUserNotFound() throws Exception {
        when(userRepository.findUserByEmail("a@mail.com")).thenReturn(Optional.empty());

        mvc.perform(post("/api/friends/send")
                .param("senderEmail", "a@mail.com")
                .param("receiverEmail", "b@mail.com")
                .with(user("a@mail.com")))
            .andExpect(status().isNotFound());
    }

    @Test
    void sendRequestOk() throws Exception {
        User sender = new User();
        sender.setEmail("a@mail.com");
        sender.setFriendRequests(new ArrayList<>());
        sender.setFriends(new ArrayList<>());

        User receiver = new User();
        receiver.setEmail("b@mail.com");
        receiver.setFriendRequests(new ArrayList<>());
        receiver.setFriends(new ArrayList<>());

        when(userRepository.findUserByEmail("a@mail.com")).thenReturn(Optional.of(sender));
        when(userRepository.findUserByEmail("b@mail.com")).thenReturn(Optional.of(receiver));

        mvc.perform(post("/api/friends/send")
                .param("senderEmail", "a@mail.com")
                .param("receiverEmail", "b@mail.com")
                .with(user("a@mail.com")))
            .andExpect(status().isOk());
    }

    @Test
    void sendRequestAlreadySent() throws Exception {
        User sender = new User();
        sender.setEmail("a@mail.com");

        User receiver = new User();
        receiver.setEmail("b@mail.com");
        receiver.setFriendRequests(new ArrayList<>(List.of(sender)));
        receiver.setFriends(new ArrayList<>());

        when(userRepository.findUserByEmail("a@mail.com")).thenReturn(Optional.of(sender));
        when(userRepository.findUserByEmail("b@mail.com")).thenReturn(Optional.of(receiver));

        mvc.perform(post("/api/friends/send")
                .param("senderEmail", "a@mail.com")
                .param("receiverEmail", "b@mail.com")
                .with(user("a@mail.com")))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("La solicitud ya fue enviada anteriormente"));
    }

    @Test
    void sendRequestMissingParams() throws Exception {
        mvc.perform(post("/api/friends/send")
                .param("senderEmail", "")
                .param("receiverEmail", "")
                .with(user("a@mail.com")))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Faltan parámetros"));
    }

    @Test
    void sendRequestServerError() throws Exception {
        when(userRepository.findUserByEmail("a@mail.com")).thenThrow(new RuntimeException("Error"));

        mvc.perform(post("/api/friends/send")
                .param("senderEmail", "a@mail.com")
                .param("receiverEmail", "b@mail.com")
                .with(user("a@mail.com")))
            .andExpect(status().isInternalServerError());
    }

    @Test
    void acceptRequestOk() throws Exception {
        User sender = new User();
        sender.setEmail("a@mail.com");
        sender.setFriends(new ArrayList<>());

        User receiver = new User();
        receiver.setEmail("b@mail.com");
        receiver.setFriends(new ArrayList<>());
        receiver.setFriendRequests(new ArrayList<>(List.of(sender)));

        when(userRepository.findUserByEmail("a@mail.com")).thenReturn(Optional.of(sender));
        when(userRepository.findUserByEmail("b@mail.com")).thenReturn(Optional.of(receiver));

        mvc.perform(post("/api/friends/accept")
                .param("senderEmail", "a@mail.com")
                .param("receiverEmail", "b@mail.com")
                .with(user("b@mail.com")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Solicitud de amistad aceptada"));
    }

    @Test
    void acceptRequestUnauthorized() throws Exception {
        mvc.perform(post("/api/friends/accept")
                .param("senderEmail", "a@mail.com")
                .param("receiverEmail", "b@mail.com")
                .with(user("otro@mail.com")))
            .andExpect(status().isUnauthorized())
            .andExpect(content().string("Acceso no autorizado"));
    }

    @Test
    void acceptRequestUserNotFound() throws Exception {
        when(userRepository.findUserByEmail("a@mail.com")).thenReturn(Optional.empty());
        when(userRepository.findUserByEmail("b@mail.com")).thenReturn(Optional.empty());

        mvc.perform(post("/api/friends/accept")
                .param("senderEmail", "a@mail.com")
                .param("receiverEmail", "b@mail.com")
                .with(user("b@mail.com")))
            .andExpect(status().isNotFound())
            .andExpect(content().string("Usuario no encontrado"));
    }

    @Test
    void rejectRequestOk() throws Exception {
        User sender = new User();
        sender.setEmail("a@mail.com");

        User receiver = new User();
        receiver.setEmail("b@mail.com");
        receiver.setFriendRequests(new ArrayList<>(List.of(sender)));

        when(userRepository.findUserByEmail("a@mail.com")).thenReturn(Optional.of(sender));
        when(userRepository.findUserByEmail("b@mail.com")).thenReturn(Optional.of(receiver));

        mvc.perform(post("/api/friends/reject")
                .param("senderEmail", "a@mail.com")
                .param("receiverEmail", "b@mail.com")
                .with(user("b@mail.com")))
            .andExpect(status().isOk())
            .andExpect(content().string("Solicitud rechazada exitosamente"));
    }

    @Test
    void rejectRequestUnauthorized() throws Exception {
        mvc.perform(post("/api/friends/reject")
                .param("senderEmail", "a@mail.com")
                .param("receiverEmail", "b@mail.com")
                .with(user("otro@mail.com")))
            .andExpect(status().isUnauthorized())
            .andExpect(content().string("Acceso no autorizado"));
    }

    @Test
    void rejectRequestUserNotFound() throws Exception {
        when(userRepository.findUserByEmail("a@mail.com")).thenReturn(Optional.empty());
        when(userRepository.findUserByEmail("b@mail.com")).thenReturn(Optional.empty());

        mvc.perform(post("/api/friends/reject")
                .param("senderEmail", "a@mail.com")
                .param("receiverEmail", "b@mail.com")
                .with(user("b@mail.com")))
            .andExpect(status().isNotFound())
            .andExpect(content().string("Usuario no encontrado"));
    }

    @Test
    void getFriendsOk() throws Exception {
        User user = new User();
        user.setEmail("a@mail.com");
        user.setFriends(new ArrayList<>());

        when(userRepository.findUserByEmail("a@mail.com")).thenReturn(Optional.of(user));

        mvc.perform(get("/api/friends/list")
                .param("email", "a@mail.com")
                .with(user("a@mail.com")))
            .andExpect(status().isOk());
    }

    @Test
    void getFriendsUserNotFound() throws Exception {
        when(userRepository.findUserByEmail("a@mail.com")).thenReturn(Optional.empty());

        mvc.perform(get("/api/friends/list")
                .param("email", "a@mail.com")
                .with(user("a@mail.com")))
            .andExpect(status().isNotFound());
    }
}