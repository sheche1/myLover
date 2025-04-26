package com.myLover.myLover.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myLover.lover.model.Goal;
import com.myLover.lover.model.User;
import com.myLover.lover.repository.GoalRepository;
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
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class)
class GoalControllerTests {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper mapper;

    @MockBean private GoalRepository goalRepository;
    @MockBean private UserRepository userRepository;

    @Test
    void getGoalsOk() throws Exception {
        User user = new User();
        user.setEmail("a@mail.com");
        Goal goal = new Goal();
        goal.setId(1L);
        goal.setTitle("Goal 1");

        when(userRepository.findUserByEmail("a@mail.com")).thenReturn(Optional.of(user));
        when(goalRepository.findByUser(user)).thenReturn(List.of(goal));

        mvc.perform(get("/api/goals").with(user("a@mail.com")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1L))
            .andExpect(jsonPath("$[0].title").value("Goal 1"));
    }

    @Test
    void getGoalsUserNotFound() {
        when(userRepository.findUserByEmail("a@mail.com")).thenReturn(Optional.empty());
    
        assertThrows(jakarta.servlet.ServletException.class,
            () -> mvc.perform(get("/api/goals").with(user("a@mail.com"))));
    }


    @Test
    void createGoalOk() throws Exception {
        User user = new User();
        user.setEmail("a@mail.com");

        Goal goal = new Goal();
        goal.setTitle("New Goal");
        goal.setDescription("Description");
        goal.setDeadline(LocalDate.now());

        when(userRepository.findUserByEmail("a@mail.com")).thenReturn(Optional.of(user));
        when(goalRepository.save(any())).thenReturn(goal);

        mvc.perform(post("/api/goals")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(goal))
                .with(user("a@mail.com")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("New Goal"));
    }

    @Test
    void createGoalUserNotFound() throws Exception {
        Goal goal = new Goal();
        goal.setTitle("New Goal");
    
        when(userRepository.findUserByEmail("a@mail.com")).thenReturn(Optional.empty());
    
        assertThrows(jakarta.servlet.ServletException.class,
            () -> mvc.perform(post("/api/goals")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(goal))
                    .with(user("a@mail.com"))));
    }


    @Test
    void updateGoalOk() throws Exception {
        Goal existing = new Goal();
        existing.setId(1L);
        existing.setTitle("Old Goal");

        Goal updated = new Goal();
        updated.setTitle("Updated Goal");
        updated.setDescription("Updated Desc");
        updated.setDeadline(LocalDate.now());
        updated.setCompleted(true);

        when(goalRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(goalRepository.save(any())).thenReturn(existing); 

        mvc.perform(put("/api/goals/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(updated))
                .with(user("a@mail.com")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Updated Goal"))
            .andExpect(jsonPath("$.completed").value(true));
    }

    @Test
    void updateGoalNotFound() throws Exception {
        when(goalRepository.findById(1L)).thenReturn(Optional.empty());

        mvc.perform(put("/api/goals/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}")
                .with(user("a@mail.com")))
            .andExpect(status().isNotFound());
    }


    @Test
    void deleteGoalOk() throws Exception {
        doNothing().when(goalRepository).deleteById(1L);

        mvc.perform(delete("/api/goals/1").with(user("a@mail.com")))
            .andExpect(status().isOk())
            .andExpect(content().string("Goal deleted"));
    }
}
