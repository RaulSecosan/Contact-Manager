
package com.contactmanager.eventservice.controller;

import com.contactmanager.eventservice.service.RegistrationConsumer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class StatsController {

    private final RegistrationConsumer consumer;

    public StatsController(RegistrationConsumer consumer) {
        this.consumer = consumer;
    }

    @GetMapping("/api/stats")
    public Map<String, Object> getStats() {
        return Map.of(
            "service", "event-service",
            "processedSinceStartup", consumer.getProcessedCount()
        );
    }
}
