package com.myLover.myLover.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myLover.lover.model.PrivateLetter;
import com.myLover.lover.repository.PrivateLetterRepository;
import com.myLover.myLover.TestSecurityConfig;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class)
class PrivateLetterControllerTests {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper mapper;
    @MockBean private PrivateLetterRepository repo;

    private PrivateLetter stub() {
        PrivateLetter p = new PrivateLetter();
        p.setSenderEmail("a@mail.com");
        p.setReceiverEmail("b@mail.com");
        p.setContent("hi");
        p.setCreatedAt(LocalDateTime.now());
        return p;
    }

    @Test
    void sendLetterBadRequest() throws Exception {
        PrivateLetter bad = new PrivateLetter();             
        mvc.perform(post("/api/letters")
                .with(SecurityMockMvcRequestPostProcessors.user("a@mail.com"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(bad)))
           .andExpect(status().isBadRequest());
    }

    @Test
    void sendLetterOk() throws Exception {
        PrivateLetter good = stub();
        when(repo.save(any())).thenReturn(good);

        mvc.perform(post("/api/letters")
                .with(SecurityMockMvcRequestPostProcessors.user("a@mail.com"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(good)))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.senderEmail").value("a@mail.com"));
    }

    @Test
    void getReceivedLettersOk() throws Exception {
        when(repo.findByReceiverEmailOrderByCreatedAtDesc("b@mail.com"))
            .thenReturn(List.of(stub()));

        mvc.perform(get("/api/letters")
                .param("receiverEmail","b@mail.com")
                .with(SecurityMockMvcRequestPostProcessors.user("b@mail.com")))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void getSentLettersOk() throws Exception {
        when(repo.findBySenderEmailOrderByCreatedAtDesc("a@mail.com"))
            .thenReturn(List.of(stub()));

        mvc.perform(get("/api/letters/sent")
                .param("senderEmail","a@mail.com")
                .with(SecurityMockMvcRequestPostProcessors.user("a@mail.com")))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void deleteLetterNotFound() throws Exception {
        when(repo.findById(5L)).thenReturn(Optional.empty());

        mvc.perform(delete("/api/letters/5")
                .with(SecurityMockMvcRequestPostProcessors.user("a@mail.com")))
           .andExpect(status().isNotFound());
    }

    @Test
    void deleteLetterOk() throws Exception {
        when(repo.findById(5L)).thenReturn(Optional.of(stub()));

        mvc.perform(delete("/api/letters/5")
                .with(SecurityMockMvcRequestPostProcessors.user("a@mail.com")))
           .andExpect(status().isOk())
           .andExpect(content().string("Carta eliminada con éxito"));
    }
}
