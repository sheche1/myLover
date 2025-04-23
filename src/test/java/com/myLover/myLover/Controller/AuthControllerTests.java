package com.myLover.myLover.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myLover.lover.model.AuthRequest;
import com.myLover.lover.model.AuthResponse;
import com.myLover.lover.model.User;
import com.myLover.lover.service.AuthService;
import com.myLover.lover.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTests {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper mapper;

    @MockBean private AuthService authService;
    @MockBean private UserService userService;

    @Test
    void loginOk() throws Exception {
        AuthRequest req = new AuthRequest();
        req.setEmail("a@mail.com");
        req.setPassword("123");

        when(authService.authenticate(any())).thenReturn(new AuthResponse("tok"));

        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("tok"));
    }

    @Test
    void loginUnauthorized() throws Exception {
        AuthRequest req = new AuthRequest();
        req.setEmail("a@mail.com");
        req.setPassword("bad");

        when(authService.authenticate(any())).thenThrow(new RuntimeException("bad"));

        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(req)))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void registerOk() throws Exception {
        User u = new User();
        u.setEmail("b@mail.com");

        when(userService.registerUser(any())).thenReturn(u);

        mvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(u)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("b@mail.com"));
    }

    @Test
    void registerBadRequest() throws Exception {
        User u = new User();
        when(userService.registerUser(any())).thenThrow(new RuntimeException("duplicado"));

        mvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(u)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("duplicado"));
    }
}