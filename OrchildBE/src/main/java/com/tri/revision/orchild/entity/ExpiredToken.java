package com.tri.revision.orchild.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Builder
@NoArgsConstructor(force = true)
@AllArgsConstructor
public class ExpiredToken {
    @Id
    private String id;

    private Instant expiredAt;


}
