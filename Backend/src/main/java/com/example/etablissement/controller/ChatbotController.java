package com.example.etablissement.controller;

import com.example.etablissement.dot.ChatRequest;
import com.example.etablissement.dot.ChatResponse;
import com.example.etablissement.service.RagClientService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "http://localhost:4200")
public class ChatbotController {

    private static final Logger log = LoggerFactory.getLogger(ChatbotController.class);
    private static final int MAX_QUESTION_LENGTH = 2000;

    private final RagClientService ragClientService;

    public ChatbotController(RagClientService ragClientService) {
        this.ragClientService = ragClientService;
    }

    @PostMapping("/ask")
    public ResponseEntity<ChatResponse> ask(@RequestBody ChatRequest request) {

        if (request == null || request.getQuestion() == null || request.getQuestion().isBlank()) {
            return ResponseEntity.badRequest().body(
                    new ChatResponse("Error: Question cannot be empty.", List.of(), 0, 0, true, "Invalid input")
            );
        }


        if (request.getQuestion().length() > MAX_QUESTION_LENGTH) {
            return ResponseEntity.badRequest().body(
                    new ChatResponse("Error: Question is too long. Maximum " + MAX_QUESTION_LENGTH + " characters allowed.",
                            List.of(), 0, 0, true, "Question too long")
            );
        }

        log.info("Received chat question: {}", request.getQuestion().substring(0, Math.min(100, request.getQuestion().length())));

        ChatResponse response = ragClientService.chat(request);

        // Return appropriate HTTP status based on response
        if (response.isError()) {
            return ResponseEntity.internalServerError().body(response);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok(ragClientService.health());
    }

    @GetMapping("/available")
    public ResponseEntity<Boolean> isAvailable() {
        return ResponseEntity.ok(ragClientService.isAvailable());
    }
}
