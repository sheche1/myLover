package com.myLover.myLover.Controller;

import com.myLover.myLover.TestSecurityConfig;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.*;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.RestTemplate;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class)
class OpenRouterControllerTests {

    @Autowired private MockMvc mvc;

    @MockBean private RestTemplate restTemplate;

    @Test
    void suggestPromptOk() throws Exception {
        String jsonBody = """
            {
              "prompt": "¿Qué puedo preguntarle a mi pareja?"
            }
            """;

        String openRouterResponse = """
            {
              "choices": [
                {
                  "message": {
                    "role": "assistant",
                    "content": "Puedes preguntarle qué le hace feliz últimamente."
                  }
                }
              ]
            }
            """;

        ResponseEntity<String> mockResponse = new ResponseEntity<>(openRouterResponse, HttpStatus.OK);
        when(restTemplate.postForEntity(Mockito.anyString(), any(), eq(String.class)))
                .thenReturn(mockResponse);

        mvc.perform(post("/api/ia/suggest")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonBody)
                .with(user("test@correo.com")))
            .andExpect(status().isOk())
            .andExpect(content().json(openRouterResponse));
    }

    @Test
    void suggestPromptVacio() throws Exception {
        String jsonBody = """
            {
              "prompt": ""
            }
            """;

        mvc.perform(post("/api/ia/suggest")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonBody)
                .with(user("test@correo.com")))
            .andExpect(status().isBadRequest())
            .andExpect(content().string("Prompt vacío"));
    }

    @Test
    void suggestPromptErrorDesdeOpenRouter() throws Exception {
        String jsonBody = """
            {
              "prompt": "¿Qué le gusta a mi pareja?"
            }
            """;

        when(restTemplate.postForEntity(Mockito.anyString(), any(), eq(String.class)))
                .thenThrow(new RuntimeException("Error simulado"));

        mvc.perform(post("/api/ia/suggest")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonBody)
                .with(user("test@correo.com")))
            .andExpect(status().isInternalServerError())
            .andExpect(content().string("Error al contactar con OpenRouter"));
    }
}
