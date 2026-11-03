
package com.contactmanager.backend.controller;

import com.contactmanager.backend.model.Contact;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ContactController {

    private final List<Contact> contacts = new ArrayList<>();

    public ContactController() {
        contacts.add(new Contact(1L, "Alex Popescu", "Timisoara, Romania", ""));
        contacts.add(new Contact(2L, "Maria Ionescu", "Bucuresti, Romania", ""));
        contacts.add(new Contact(3L, "Andrei Marin", "Cluj-Napoca, Romania", ""));
    }

    @GetMapping("/api/contacts")
    public List<Contact> getContacts() {
        return contacts;
    }

    @GetMapping("/api/contacts/search")
    public List<Contact> searchContacts(@RequestParam String name) {
        return contacts.stream()
                .filter(contact -> contact.name().toLowerCase()
                        .contains(name.toLowerCase()))
                .toList();
    }
}
