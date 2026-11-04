
package com.contactmanager.eventservice.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicInteger;

@Service
public class RegistrationConsumer {

    private final AtomicInteger processedCount = new AtomicInteger(0);

    @KafkaListener(topics = "user-registered")
    public void receiveMessage(String email) {
        System.out.println("New registration: " + email);
        processedCount.incrementAndGet();
    }

    public int getProcessedCount() {
        return processedCount.get();
    }
}
