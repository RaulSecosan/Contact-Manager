
package com.contactmanager.backend.model;

public record Contact(
    Long id,
    String name,
    String address,
    String picture
) {
}
