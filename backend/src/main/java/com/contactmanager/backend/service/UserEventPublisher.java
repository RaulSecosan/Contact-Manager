
package com.contactmanager.backend.service;

import com.contactmanager.backend.model.User;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class UserEventPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public UserEventPublisher(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void userRegistered(User user) {
        kafkaTemplate.send(
            "user-registered",
            user.getId().toString(),
            user.getEmail()
        );
    }
}
