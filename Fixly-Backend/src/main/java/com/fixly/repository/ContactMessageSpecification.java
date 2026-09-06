package com.fixly.repository;

import org.springframework.data.jpa.domain.Specification;

import com.fixly.entity.ContactMessage;
import com.fixly.enums.ContactReason;
import com.fixly.enums.ContactStatus;
import com.fixly.enums.ContactUserType;

import jakarta.persistence.criteria.Predicate;

/**
 * Database-driven dynamic filtering for the admin list endpoint — avoids
 * loading all rows into memory and filtering in Java, and avoids a
 * combinatorial explosion of repository finder methods.
 */
public final class ContactMessageSpecification {

    private ContactMessageSpecification() {
    }

    public static Specification<ContactMessage> withFilters(
            ContactUserType userType, ContactStatus status, ContactReason reason, String search) {
        return (root, query, cb) -> {
            Predicate predicate = cb.conjunction();

            if (userType != null) {
                predicate = cb.and(predicate, cb.equal(root.get("userType"), userType));
            }
            if (status != null) {
                predicate = cb.and(predicate, cb.equal(root.get("status"), status));
            }
            if (reason != null) {
                predicate = cb.and(predicate, cb.equal(root.get("reason"), reason));
            }
            if (search != null && !search.isBlank()) {
                String like = "%" + search.trim().toLowerCase() + "%";
                Predicate nameLike = cb.like(cb.lower(root.get("name")), like);
                Predicate emailLike = cb.like(cb.lower(root.get("email")), like);
                Predicate subjectLike = cb.like(cb.lower(root.get("subject")), like);
                predicate = cb.and(predicate, cb.or(nameLike, emailLike, subjectLike));
            }

            return predicate;
        };
    }
}