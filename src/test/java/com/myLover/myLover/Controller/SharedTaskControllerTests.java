package com.myLover.myLover.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myLover.lover.model.SharedTask;
import com.myLover.lover.model.User;
import com.myLover.lover.repository.TaskCollaborationRequestRepository;
import com.myLover.lover.repository.UserRepository;
import com.myLover.lover.service.SharedTaskService;
import com.myLover.myLover.TestSecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class)
class SharedTaskControllerTests {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper mapper;

    @MockBean private SharedTaskService service;
    @MockBean private UserRepository userRepository;
    @MockBean private TaskCollaborationRequestRepository collabRepo;

    @Test
    void listOk() throws Exception {
        User user = new User(); user.setEmail("a@mail.com");
        SharedTask task = new SharedTask(); task.setId(1L); task.setTitle("Tarea 1");

        when(userRepository.findUserByEmail("a@mail.com")).thenReturn(Optional.of(user));
        when(service.listFor(user)).thenReturn(List.of(task));

        mvc.perform(get("/api/tasks").with(user("a@mail.com")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void createOk() throws Exception {
        User creator = new User(); creator.setEmail("a@mail.com");
        User assigned = new User(); assigned.setEmail("b@mail.com");

        SharedTask task = new SharedTask(); task.setTitle("Nueva tarea");
        SharedTask saved = new SharedTask(); saved.setId(1L); saved.setTitle("Nueva tarea");

        task.setAssignedTo(assigned);

        when(userRepository.findUserByEmail("a@mail.com")).thenReturn(Optional.of(creator));
        when(userRepository.findUserByEmail("b@mail.com")).thenReturn(Optional.of(assigned));
        when(service.create(any())).thenReturn(saved);

        mvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(task))
                .with(user("a@mail.com")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void updateOk() throws Exception {
        User assigned = new User(); assigned.setEmail("b@mail.com");

        SharedTask task = new SharedTask();
        task.setTitle("Actualizada");
        task.setAssignedTo(assigned);

        when(userRepository.findUserByEmail("b@mail.com")).thenReturn(Optional.of(assigned));
        when(service.update(eq(1L), any())).thenReturn(task);

        mvc.perform(put("/api/tasks/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(task))
                .with(user("a@mail.com")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Actualizada"));
    }

    @Test
    void deleteOk() throws Exception {
        doNothing().when(service).delete(1L);

        mvc.perform(delete("/api/tasks/1").with(user("a@mail.com")))
            .andExpect(status().isOk())
            .andExpect(content().string("ok"));
    }
}
