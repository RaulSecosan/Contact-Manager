
package com.contactmanager.backend.repository;

import com.contactmanager.backend.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    List<Contact> findByNameContainingIgnoreCase(String name);
}
