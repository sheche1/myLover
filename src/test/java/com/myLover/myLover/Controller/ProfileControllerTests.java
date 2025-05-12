package com.myLover.myLover.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myLover.lover.model.User;
import com.myLover.lover.repository.UserRepository;
import com.myLover.lover.service.UserService;
import com.myLover.myLover.TestSecurityConfig;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import java.util.List;
import java.util.Collections;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class)
class ProfileControllerTests {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper mapper;

    @MockBean private UserService userService;
    @MockBean private UserRepository userRepository;

    @Test
    void getProfileUnauthorized() throws Exception {
        mvc.perform(get("/api/profile"))
           .andExpect(status().isUnauthorized());
    }

    @Test
    void getProfileNotFound() throws Exception {
        when(userService.findUserByEmail("a@mail.com")).thenReturn(null);

        mvc.perform(get("/api/profile")
                .with(SecurityMockMvcRequestPostProcessors.user("a@mail.com")))
           .andExpect(status().isNotFound());
    }

    @Test
    void getProfileOk() throws Exception {
        User u = new User(); u.setEmail("a@mail.com"); u.setNombre("Ana");
        when(userService.findUserByEmail("a@mail.com")).thenReturn(u);

        mvc.perform(get("/api/profile")
                .with(SecurityMockMvcRequestPostProcessors.user("a@mail.com")))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.nombre", is("Ana")));
    }

    @Test
    void updateProfileUnauthorized() throws Exception {
        mvc.perform(put("/api/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
           .andExpect(status().isUnauthorized());
    }

    @Test
    void updateProfileNotFound() throws Exception {
        when(userService.findUserByEmail("a@mail.com")).thenReturn(null);

        mvc.perform(put("/api/profile")
                .with(SecurityMockMvcRequestPostProcessors.user("a@mail.com"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
           .andExpect(status().isNotFound());
    }

    @Test
    void updateProfileOk() throws Exception {
        User u = new User(); u.setEmail("a@mail.com");
        when(userService.findUserByEmail("a@mail.com")).thenReturn(u);
        when(userService.saveUser(ArgumentMatchers.any())).thenReturn(u);

        mvc.perform(put("/api/profile")
                .with(SecurityMockMvcRequestPostProcessors.user("a@mail.com"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
           .andExpect(status().isOk());
    }

    @Test
    void updateStatusUnauthorized() throws Exception {
        mvc.perform(put("/api/profile/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"ok\"}"))
           .andExpect(status().isUnauthorized());
    }

    @Test
    void updateStatusOk() throws Exception {
        mvc.perform(put("/api/profile/status")
                .with(SecurityMockMvcRequestPostProcessors.user("a@mail.com"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"feliz\"}"))
           .andExpect(status().isOk())
           .andExpect(content().string("Estado actualizado correctamente"));
    }

    @Test
    void getStatusOk() throws Exception {
        when(userService.getUserStatus("b@mail.com")).thenReturn("feliz");

        mvc.perform(get("/api/profile/status")
                .param("email", "b@mail.com"))
           .andExpect(status().isOk())
           .andExpect(content().string("feliz"));
    }

    @Test
    void getPartnerStatusOk() throws Exception {
        User pareja = new User();
        pareja.setEmail("pareja@mail.com");
        pareja.setNombre("Lucía");
        pareja.setStatus("Regular");

        User yo = new User();
        yo.setEmail("yo@mail.com");
        yo.setFriends(List.of(pareja));

        when(userService.findUserByEmail("yo@mail.com")).thenReturn(yo);

        mvc.perform(get("/api/profile/partner-status")
                .with(user("yo@mail.com")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("Regular"))
            .andExpect(jsonPath("$.nombre").value("Lucía"))
            .andExpect(jsonPath("$.email").value("pareja@mail.com"));
    }

    @Test
    void getPartnerStatusSinPareja() throws Exception {
        User yo = new User();
        yo.setEmail("yo@mail.com");
        yo.setFriends(Collections.emptyList());

        when(userService.findUserByEmail("yo@mail.com")).thenReturn(yo);

        mvc.perform(get("/api/profile/partner-status")
                .with(user("yo@mail.com")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("none"));
    }

    @Test
    void getPartnerStatusUsuarioNoExiste() throws Exception {
        when(userService.findUserByEmail("yo@mail.com")).thenReturn(null);

        mvc.perform(get("/api/profile/partner-status")
                .with(user("yo@mail.com")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("none"));
    }
    
}
