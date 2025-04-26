package com.myLover.myLover.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myLover.lover.model.ImportantEvent;
import com.myLover.lover.model.User;
import com.myLover.lover.repository.ImportantEventRepository;
import com.myLover.lover.repository.UserRepository;
import com.myLover.myLover.TestSecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class)
class ImportantEventControllerTests {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper mapper;

    @MockBean private ImportantEventRepository eventRepo;
    @MockBean private UserRepository userRepo;

    @Test
    void getEventsOk() throws Exception {
        User user = new User(); user.setEmail("a@mail.com");
        ImportantEvent ev = new ImportantEvent(); ev.setId(1L); ev.setTitle("Evt");
        when(userRepo.findUserByEmail("a@mail.com")).thenReturn(Optional.of(user));
        when(eventRepo.findByUser(user)).thenReturn(List.of(ev));

        mvc.perform(get("/api/important-events").with(user("a@mail.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void getEventsUserNotFound() {
        when(userRepo.findUserByEmail("a@mail.com")).thenReturn(Optional.empty());
        assertThrows(jakarta.servlet.ServletException.class,
                () -> mvc.perform(get("/api/important-events").with(user("a@mail.com"))));
    }

    @Test
    void createEventOk() throws Exception {
        User user = new User(); user.setEmail("a@mail.com");
        ImportantEvent ev = new ImportantEvent();
        ev.setTitle("Evt"); ev.setDate(LocalDate.now());
        when(userRepo.findUserByEmail("a@mail.com")).thenReturn(Optional.of(user));
        when(eventRepo.save(any())).thenReturn(ev);

        mvc.perform(post("/api/important-events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(ev))
                .with(user("a@mail.com")))
            .andExpect(status().isOk())
            .andExpect(content().string("Event saved successfully"));
    }

    @Test
    void createEventUserNotFound() throws Exception {
        ImportantEvent ev = new ImportantEvent(); ev.setTitle("X");
        when(userRepo.findUserByEmail("a@mail.com")).thenReturn(Optional.empty());
        assertThrows(jakarta.servlet.ServletException.class,
                () -> mvc.perform(post("/api/important-events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(ev))
                        .with(user("a@mail.com"))));
    }

    @Test
    void editEventOk() throws Exception {
        ImportantEvent stored = new ImportantEvent(); stored.setId(1L);
        ImportantEvent upd = new ImportantEvent(); upd.setTitle("New");
        when(eventRepo.findById(1L)).thenReturn(Optional.of(stored));
        mvc.perform(put("/api/important-events/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(upd))
                .with(user("a@mail.com")))
            .andExpect(status().isOk())
            .andExpect(content().string("Event updated"));
    }

    @Test
    void editEventNotFound() throws Exception {
        when(eventRepo.findById(1L)).thenReturn(Optional.empty());
        mvc.perform(put("/api/important-events/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}")
                .with(user("a@mail.com")))
            .andExpect(status().isNotFound());
    }

    @Test
    void deleteEventOk() throws Exception {
        ImportantEvent ev = new ImportantEvent(); ev.setId(1L);
        when(eventRepo.findById(1L)).thenReturn(Optional.of(ev));
        doNothing().when(eventRepo).delete(ev);

        mvc.perform(delete("/api/important-events/1").with(user("a@mail.com")))
            .andExpect(status().isOk())
            .andExpect(content().string("Event deleted"));
    }

    @Test
    void deleteEventNotFound() throws Exception {
        when(eventRepo.findById(1L)).thenReturn(Optional.empty());
        mvc.perform(delete("/api/important-events/1").with(user("a@mail.com")))
            .andExpect(status().isNotFound());
    }
}
