
package com.contactmanager.backend.controller;

import com.contactmanager.backend.model.Contact;
import com.contactmanager.backend.repository.ContactRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactRepository repository;

    public ContactController(ContactRepository repository) {
        this.repository = repository;
    }

    // Get all contacts
    @GetMapping
    public List<Contact> getContacts() {
        return repository.findAll();
    }

    // Search contacts by name
    @GetMapping("/search")
    public List<Contact> searchContacts(@RequestParam String name) {
        return repository.findByNameContainingIgnoreCase(name);
    }

    // Add a new contact
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Contact addContact(@RequestBody Contact contact) {
        Contact newContact = new Contact(
            contact.getName(),
            contact.getAddress(),
            contact.getPicture()
        );

        return repository.save(newContact);
    }

    // Edit an existing contact
    @PutMapping("/{id}")
    public Contact editContact(
        @PathVariable Long id,
        @RequestBody Contact updatedContact
    ) {
        Contact contact = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Contact not found"
            ));

        contact.setName(updatedContact.getName());
        contact.setAddress(updatedContact.getAddress());
        contact.setPicture(updatedContact.getPicture());

        return repository.save(contact);
    }

    // Delete a contact
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteContact(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Contact not found"
            );
        }

        repository.deleteById(id);
    }
}
