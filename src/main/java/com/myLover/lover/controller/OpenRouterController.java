package com.myLover.lover.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/ia")
public class OpenRouterController {

    @Value("${openrouter.api.key}")
    private String apiKey;
    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/suggest")
    public ResponseEntity<?> askOpenRouter(@RequestBody Map<String, String> body) {
        String prompt = body.get("prompt");
        if (prompt == null || prompt.isEmpty()) {
            return ResponseEntity.badRequest().body("Prompt vacío");
        }

        String url = "https://openrouter.ai/api/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("X-Title", "MyLover-FriendsPage");

        String json = """
            {
              "model": "mistralai/mistral-7b-instruct:free",
              "messages": [
                {"role": "system", "content": "Eres un consejero amistoso."},
                {"role": "user", "content": "%s"}
              ]
            }
            """.formatted(prompt);

        HttpEntity<String> request = new HttpEntity<>(json, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al contactar con OpenRouter");
        }
    }
}

