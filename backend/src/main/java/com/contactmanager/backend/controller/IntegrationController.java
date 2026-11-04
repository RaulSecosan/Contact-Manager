
package com.contactmanager.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@RestController
public class IntegrationController {

    private final RestClient restClient;
    private final String eventServiceUrl;

    public IntegrationController(
            @Value("${app.event-service-url}") String eventServiceUrl) {
        this.restClient = RestClient.create();
        this.eventServiceUrl = eventServiceUrl;
    }

    @GetMapping("/api/integration/registration-stats")
    public ResponseEntity<String> getRegistrationStats() {

        String result = restClient.get()
            .uri(eventServiceUrl + "/api/stats")
            .retrieve()
            .body(String.class);

        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(result);
    }
}
