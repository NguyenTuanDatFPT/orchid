package com.tri.revision.orchild.config;

import com.tri.revision.orchild.entity.Orchid;
import com.tri.revision.orchild.entity.User;
import com.tri.revision.orchild.enums.Role;
import com.tri.revision.orchild.repository.OrchidRepository;
import com.tri.revision.orchild.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final UserRepository userRepository;
    private final OrchidRepository orchidRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public ApplicationRunner dataSeederRunner() {
        return args -> {
            seedUsers();
            seedOrchids();
        };
    }

    private void seedUsers() {
        // Create admin user if not exists
        if (!userRepository.existsUserByRole(Role.ADMIN)) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin"))
                    .email("admin@orchid.com")
                    .firstName("System")
                    .lastName("Admin")
                    .role(Role.ADMIN)
                    .isActive(true)
                    .build();
            userRepository.save(admin);
            log.info("✅ Created admin user (admin/admin)");
        }

        // Create staff user if not exists
        if (!userRepository.existsByUsername("staff")) {
            User staff = User.builder()
                    .username("staff")
                    .password(passwordEncoder.encode("staff123"))
                    .email("staff@orchid.com")
                    .firstName("Staff")
                    .lastName("Manager")
                    .role(Role.STAFF)
                    .isActive(true)
                    .build();
            userRepository.save(staff);
            log.info("✅ Created staff user (staff/staff123)");
        }

        // Create demo user if not exists
        if (!userRepository.existsByUsername("user")) {
            User user = User.builder()
                    .username("user")
                    .password(passwordEncoder.encode("user123"))
                    .email("user@example.com")
                    .firstName("Demo")
                    .lastName("User")
                    .role(Role.USER)
                    .isActive(true)
                    .build();
            userRepository.save(user);
            log.info("✅ Created demo user (user/user123)");
        }
    }

    private void seedOrchids() {
        if (orchidRepository.count() == 0) {
            User admin = userRepository.findUserByUsername("admin").orElse(null);
            String imageUrl = "https://images.unsplash.com/photo-1611820135074-e2d0e3e92322?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG9yY2hpZHxlbnwwfHwwfHx8MA%3D%3D";

            List<Orchid> orchids = new ArrayList<>();

            // Create 20 different orchid varieties
            orchids.add(createOrchid("Phalaenopsis White", "Elegant white moth orchid perfect for beginners", 
                    new BigDecimal("199.99"), 25, imageUrl, "Thailand", "White", "Medium", true, true, admin));

            orchids.add(createOrchid("Cattleya Purple Queen", "Stunning purple cattleya with large blooms", 
                    new BigDecimal("299.99"), 15, imageUrl, "Brazil", "Purple", "Large", true, true, admin));

            orchids.add(createOrchid("Dendrobium Golden", "Beautiful golden yellow dendrobium orchid", 
                    new BigDecimal("249.99"), 20, imageUrl, "Australia", "Yellow", "Medium", true, true, admin));

            orchids.add(createOrchid("Vanda Blue Magic", "Rare blue vanda orchid with unique coloring", 
                    new BigDecimal("599.99"), 8, imageUrl, "Singapore", "Blue", "Large", true, true, admin));

            orchids.add(createOrchid("Oncidium Dancing Lady", "Cheerful yellow dancing lady orchid", 
                    new BigDecimal("179.99"), 30, imageUrl, "Ecuador", "Yellow", "Small", true, true, admin));

            orchids.add(createOrchid("Cymbidium Green Cascade", "Graceful green cymbidium with cascading blooms", 
                    new BigDecimal("349.99"), 12, imageUrl, "Myanmar", "Green", "Large", true, true, admin));

            orchids.add(createOrchid("Paphiopedilum Lady Slipper", "Exotic lady slipper orchid with unique pouch", 
                    new BigDecimal("449.99"), 10, imageUrl, "Vietnam", "Burgundy", "Medium", true, true, admin));

            orchids.add(createOrchid("Miltonia Pansy Face", "Sweet pansy-faced orchid with fragrance", 
                    new BigDecimal("219.99"), 18, imageUrl, "Colombia", "Pink", "Medium", true, true, admin));

            orchids.add(createOrchid("Brassia Spider Orchid", "Dramatic spider orchid with long petals", 
                    new BigDecimal("279.99"), 14, imageUrl, "Panama", "Green-Yellow", "Large", true, true, admin));

            orchids.add(createOrchid("Zygopetalum Fragrant Beauty", "Highly fragrant purple and white orchid", 
                    new BigDecimal("329.99"), 16, imageUrl, "Brazil", "Purple-White", "Medium", true, true, admin));

            orchids.add(createOrchid("Epidendrum Star Valley", "Compact star-shaped orange orchid", 
                    new BigDecimal("159.99"), 35, imageUrl, "Costa Rica", "Orange", "Small", true, true, admin));

            orchids.add(createOrchid("Masdevallia Miniature Gem", "Tiny but vibrant red masdevallia", 
                    new BigDecimal("189.99"), 22, imageUrl, "Peru", "Red", "Mini", true, true, admin));

            orchids.add(createOrchid("Brassavola Lady of the Night", "Night-blooming white orchid with strong fragrance", 
                    new BigDecimal("239.99"), 19, imageUrl, "Honduras", "White", "Medium", true, true, admin));

            orchids.add(createOrchid("Ludisia Black Jewel", "Unique terrestrial orchid with dark foliage", 
                    new BigDecimal("129.99"), 40, imageUrl, "China", "Black-Red", "Small", true, true, admin));

            orchids.add(createOrchid("Aerangis Moonlight", "Pristine white aerangis with night fragrance", 
                    new BigDecimal("389.99"), 11, imageUrl, "Madagascar", "White", "Small", true, true, admin));

            orchids.add(createOrchid("Bulbophyllum Medusae", "Exotic bulbophyllum with unusual flower structure", 
                    new BigDecimal("469.99"), 7, imageUrl, "Indonesia", "Yellow-Brown", "Medium", true, true, admin));

            orchids.add(createOrchid("Maxillaria Coconut Pie", "Sweet coconut-scented yellow orchid", 
                    new BigDecimal("199.99"), 28, imageUrl, "Mexico", "Yellow", "Small", true, true, admin));

            orchids.add(createOrchid("Dracula Vampire Orchid", "Gothic black dracula orchid for collectors", 
                    new BigDecimal("549.99"), 6, imageUrl, "Ecuador", "Black", "Medium", true, true, admin));

            orchids.add(createOrchid("Vanilla Planifolia", "The original vanilla orchid vine", 
                    new BigDecimal("399.99"), 9, imageUrl, "Madagascar", "Cream", "Vine", true, true, admin));

            orchids.add(createOrchid("Angraecum Star of Bethlehem", "Magnificent white Christmas orchid", 
                    new BigDecimal("699.99"), 5, imageUrl, "Madagascar", "White", "Large", true, true, admin));

            orchidRepository.saveAll(orchids);
            log.info("✅ Created {} orchid varieties for the collection", orchids.size());
        }
    }

    private Orchid createOrchid(String name, String description, BigDecimal price, Integer stock, 
                               String imageUrl, String origin, String color, String size, 
                               boolean isNatural, boolean isAvailable, User createdBy) {
        return Orchid.builder()
                .name(name)
                .description(description)
                .price(price)
                .stock(stock)
                .imageUrl(imageUrl)
                .origin(origin)
                .color(color)
                .size(size)
                .isNatural(isNatural)
                .isAvailable(isAvailable)
                .createdBy(createdBy)
                .build();
    }
}
