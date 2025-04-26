package com.myLover.myLover.Controller;

import com.myLover.lover.model.Message;
import com.myLover.lover.repository.MessageRepository;
import com.myLover.myLover.TestSecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class)
class MessageControllerTests {

    @Autowired private MockMvc mvc;
    @MockBean private MessageRepository repo;

    @Test
    void saveMessageOk() throws Exception {
        Message m = new Message();
        m.setSenderEmail("a@mail.com");
        m.setReceiverEmail("b@mail.com");
        m.setContent("hi");
        m.setTimestamp(LocalDateTime.now());

        when(repo.save(any())).thenReturn(m);

        mvc.perform(post("/api/messages")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                         {"senderEmail":"a@mail.com","receiverEmail":"b@mail.com","content":"hi"}
                         """))
           .andExpect(status().isOk());
    }

    @Test
    void getConversationOk() throws Exception {
        when(repo.findConversation("a@mail.com","b@mail.com"))
                .thenReturn(List.of());

        mvc.perform(get("/api/messages")
                .param("user1","a@mail.com")
                .param("user2","b@mail.com"))
           .andExpect(status().isOk());
    }
}
