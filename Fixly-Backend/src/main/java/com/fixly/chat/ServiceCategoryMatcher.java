package com.fixly.chat;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fixly.entity.ServiceCategory;
import com.fixly.repository.ServiceCategoryRepository;

/**
 * Maps colloquial symptoms ("leaking tap", "fan not working") to whatever
 * ServiceCategory actually exists in the database right now. NEVER claims a
 * category exists unless it's genuinely found via ServiceCategoryRepository.
 */
@Component
public class ServiceCategoryMatcher {

        @Autowired
        private ServiceCategoryRepository categoryRepository;

        // fragment -> DB category-name substrings to look for (case-insensitive)
        private static final Map<String, List<String>> SYNONYMS = new LinkedHashMap<>();

        static {
                SYNONYMS.put("plumb", List.of("plumber", "plumbing", "pipe leak", "leaking tap",
                                "leaking pipe", "tap", "faucet", "sink", "drain", "toilet"));
                SYNONYMS.put("electric", List.of("electrician", "electrical", "wiring", "switch",
                                "socket", "fan is not working", "short circuit", "electricity problem"));
                SYNONYMS.put("clean", List.of("cleaner", "cleaning", "clean my house", "house cleaning",
                                "deep cleaning"));
                SYNONYMS.put("child", List.of("child care", "childcare", "babysitter", "nanny",
                                "baby care", "kids care"));
                SYNONYMS.put("applianc", List.of("appliance", "washing machine", "fridge",
                                "refrigerator", "microwave", "water purifier"));
                SYNONYMS.put("ac", List.of("ac repair", "ac not cooling", "air conditioner",
                                "air conditioning", "cooling problem"));
                SYNONYMS.put("paint", List.of("painter", "painting"));
                SYNONYMS.put("carpent", List.of("carpenter", "carpentry", "furniture repair"));
                SYNONYMS.put("pest", List.of("pest control", "pest problem", "termite", "cockroach"));
                SYNONYMS.put("salon", List.of("salon", "beauty", "beautician", "haircut", "spa"));
                SYNONYMS.put("garden", List.of("gardening", "gardener", "lawn"));
                SYNONYMS.put("mov", List.of("moving", "shifting", "relocation", "movers"));
                SYNONYMS.put("event", List.of("event service", "party service", "decoration"));
        }

        public Optional<ServiceCategory> matchCategory(String normalizedMessage) {
                String fragment = null;
                for (Map.Entry<String, List<String>> entry : SYNONYMS.entrySet()) {
                        if (entry.getValue().stream().anyMatch(normalizedMessage::contains)) {
                                fragment = entry.getKey();
                                break;
                        }
                }
                if (fragment == null)
                        return Optional.empty();

                String f = fragment;
                return categoryRepository.findAll().stream()
                                .filter(c -> c.getName() != null && c.getName().toLowerCase().contains(f))
                                .findFirst();
        }
}