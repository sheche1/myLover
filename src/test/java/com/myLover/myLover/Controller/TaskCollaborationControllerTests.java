package com.myLover.myLover.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myLover.lover.model.TaskCollaborationRequest;
import com.myLover.lover.model.User;
import com.myLover.lover.repository.TaskCollaborationRequestRepository;
import com.myLover.lover.repository.UserRepository;
import com.myLover.myLover.TestSecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class)
class TaskCollaborationControllerTests {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper mapper;

    @MockBean private TaskCollaborationRequestRepository collabRepo;
    @MockBean private UserRepository userRepo;

    @Test
    void sendRequestEmptyEmail() throws Exception {
        mvc.perform(post("/api/task-collab/send?receiverEmail=")
                .with(user("a@mail.com")))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Email destino vacío"));
    }

    @Test
    void sendRequestAlreadyExists() throws Exception {
        User sender = new User(); sender.setEmail("a@mail.com");
        User receiver = new User(); receiver.setEmail("b@mail.com");

        when(userRepo.findUserByEmail("a@mail.com")).thenReturn(Optional.of(sender));
        when(userRepo.findUserByEmail("b@mail.com")).thenReturn(Optional.of(receiver));
        when(collabRepo.existsByRequesterAndReceiver(any(), any())).thenReturn(true);

        mvc.perform(post("/api/task-collab/send?receiverEmail=b@mail.com").with(user("a@mail.com")))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Ya existe una solicitud"));
    }

    @Test
    void sendRequestOk() throws Exception {
        User sender = new User(); sender.setEmail("a@mail.com");
        User receiver = new User(); receiver.setEmail("b@mail.com");

        when(userRepo.findUserByEmail("a@mail.com")).thenReturn(Optional.of(sender));
        when(userRepo.findUserByEmail("b@mail.com")).thenReturn(Optional.of(receiver));
        when(collabRepo.existsByRequesterAndReceiver(any(), any())).thenReturn(false);

        mvc.perform(post("/api/task-collab/send?receiverEmail=b@mail.com").with(user("a@mail.com")))
            .andExpect(status().isOk())
            .andExpect(content().string("Solicitud enviada"));
    }

    @Test
    void acceptRequestForbidden() throws Exception {
        User someone = new User(); someone.setEmail("notreceiver@mail.com");
        TaskCollaborationRequest req = new TaskCollaborationRequest();
        req.setReceiver(new User()); req.getReceiver().setEmail("b@mail.com");

        when(collabRepo.findById(1L)).thenReturn(Optional.of(req));

        mvc.perform(post("/api/task-collab/accept?requestId=1").with(user("notreceiver@mail.com")))
            .andExpect(status().isForbidden());
    }

    @Test
    void acceptRequestOk() throws Exception {
        User receiver = new User(); receiver.setEmail("a@mail.com");
        TaskCollaborationRequest req = new TaskCollaborationRequest();
        req.setReceiver(receiver);

        when(collabRepo.findById(1L)).thenReturn(Optional.of(req));

        mvc.perform(post("/api/task-collab/accept?requestId=1").with(user("a@mail.com")))
            .andExpect(status().isOk())
            .andExpect(content().string("Solicitud aceptada"));
    }

    @Test
    void pendingRequestsOk() throws Exception {
        User user = new User(); user.setEmail("a@mail.com");
        TaskCollaborationRequest r = new TaskCollaborationRequest(); r.setId(1L);

        when(userRepo.findUserByEmail("a@mail.com")).thenReturn(Optional.of(user));
        when(collabRepo.findByReceiverAndAcceptedFalse(user)).thenReturn(List.of(r));

        mvc.perform(get("/api/task-collab/pending").with(user("a@mail.com")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void acceptedCollaboratorsOk() throws Exception {
        User me = new User(); me.setEmail("a@mail.com");
        User other = new User(); other.setEmail("b@mail.com");

        TaskCollaborationRequest r = new TaskCollaborationRequest();
        r.setRequester(me); r.setReceiver(other); r.setAccepted(true);

        when(userRepo.findUserByEmail("a@mail.com")).thenReturn(Optional.of(me));
        when(collabRepo.findAll()).thenReturn(List.of(r));

        mvc.perform(get("/api/task-collab/accepted").with(user("a@mail.com")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].email").value("b@mail.com"));
    }
}
