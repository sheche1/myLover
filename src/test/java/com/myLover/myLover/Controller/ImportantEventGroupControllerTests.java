package com.myLover.myLover.Controller;

import com.myLover.lover.model.ImportantEvent;
import com.myLover.lover.model.ImportantEventGroup;
import com.myLover.lover.model.User;
import com.myLover.lover.repository.ImportantEventGroupRepository;
import com.myLover.lover.repository.ImportantEventRepository;
import com.myLover.lover.repository.UserRepository;
import com.myLover.myLover.TestSecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

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
class ImportantEventGroupControllerTests {

    @Autowired private MockMvc mvc;

    @MockBean private ImportantEventGroupRepository groupRepo;
    @MockBean private ImportantEventRepository eventRepo;
    @MockBean private UserRepository userRepo;

    private User buildUser() {
        User u = new User();
        u.setId(1L);
        u.setEmail("user@mail.com");
        return u;
    }

    private ImportantEventGroup buildGroup(User u) {
        ImportantEventGroup g = new ImportantEventGroup();
        g.setId(1L);
        g.setTitle("Group");
        g.setUser(u);
        return g;
    }

    @Test
    void createGroup_withPhotoAndEvents_ok() throws Exception {
        User u = buildUser();
        ImportantEventGroup g = buildGroup(u);
        ImportantEvent ev = new ImportantEvent(); ev.setId(7L);

        when(userRepo.findUserByEmail(u.getEmail())).thenReturn(Optional.of(u));
        when(groupRepo.save(any())).thenReturn(g);
        when(groupRepo.findWithEventsByUser(u)).thenReturn(List.of(g));
        when(eventRepo.findById(7L)).thenReturn(Optional.of(ev));

        MockMultipartFile file = new MockMultipartFile(
                "photo","img.png","image/png","X".getBytes());

        mvc.perform(multipart("/api/event-groups")
                .file(file)
                .param("title","Group")
                .param("description","Desc")
                .param("eventIds","7")
                .with(user(u.getEmail())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Group"));

        verify(eventRepo).save(ev);
    }

    @Test
    void updateGroup_changesPhotoAndEvents_ok() throws Exception {
        User u = buildUser();
        ImportantEventGroup g = buildGroup(u);

        ImportantEvent oldEv = new ImportantEvent(); oldEv.setId(2L); oldEv.setGroup(g);
        ImportantEvent ev3   = new ImportantEvent(); ev3.setId(3L);
        ImportantEvent ev4   = new ImportantEvent(); ev4.setId(4L);

        when(userRepo.findUserByEmail(u.getEmail())).thenReturn(Optional.of(u));
        when(groupRepo.findById(1L)).thenReturn(Optional.of(g));
        when(groupRepo.save(any())).thenReturn(g);
        when(eventRepo.findByGroup(g)).thenReturn(List.of(oldEv));
        when(eventRepo.findById(3L)).thenReturn(Optional.of(ev3));
        when(eventRepo.findById(4L)).thenReturn(Optional.of(ev4));

        MockMultipartFile file = new MockMultipartFile(
                "photo","new.png","image/png","Y".getBytes());

        MockHttpServletRequestBuilder putReq = multipart("/api/event-groups/1")
                .file(file)
                .param("title","New")
                .param("description","Updated")
                .param("eventIds","3","4")
                .with(req -> { req.setMethod("PUT"); return req; });

        mvc.perform(putReq.with(user(u.getEmail())))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.title").value("New"));

        verify(eventRepo).save(oldEv);
        verify(eventRepo).save(ev3);
        verify(eventRepo).save(ev4);
    }

    @Test
    void deleteGroup_unlinksEvents_ok() throws Exception {
        User u = buildUser();
        ImportantEventGroup g = buildGroup(u);
        ImportantEvent e1 = new ImportantEvent(); e1.setId(9L); e1.setGroup(g);

        when(userRepo.findUserByEmail(u.getEmail())).thenReturn(Optional.of(u));
        when(groupRepo.findById(1L)).thenReturn(Optional.of(g));
        when(eventRepo.findByGroup(g)).thenReturn(List.of(e1));

        mvc.perform(delete("/api/event-groups/1").with(user(u.getEmail())))
           .andExpect(status().isOk());

        verify(eventRepo).save(e1);
        verify(groupRepo).delete(g);
    }

    @Test
    void operationsByNonOwner_forbidden() throws Exception {
        User owner = buildUser();
        User other = new User(); other.setId(5L); other.setEmail("other@mail.com");
        ImportantEventGroup g = buildGroup(owner);

        when(userRepo.findUserByEmail(other.getEmail())).thenReturn(Optional.of(other));
        when(groupRepo.findById(1L)).thenReturn(Optional.of(g));

        MockHttpServletRequestBuilder putReq = multipart("/api/event-groups/1")
                .param("title","X").param("description","Y")
                .with(req -> { req.setMethod("PUT"); return req; });

        mvc.perform(putReq.with(user(other.getEmail()))).andExpect(status().isForbidden());
        mvc.perform(delete("/api/event-groups/1").with(user(other.getEmail()))).andExpect(status().isForbidden());
    }

    @Test
    void getGroups_userNotFound_throws() {
        when(userRepo.findUserByEmail("x")).thenReturn(Optional.empty());

        assertThrows(jakarta.servlet.ServletException.class,
                () -> mvc.perform(get("/api/event-groups").with(user("x"))));
    }
}
