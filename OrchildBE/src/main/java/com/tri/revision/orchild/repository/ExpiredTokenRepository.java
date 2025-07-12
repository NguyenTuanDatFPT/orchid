package com.tri.revision.orchild.repository;

import com.tri.revision.orchild.entity.ExpiredToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpiredTokenRepository extends JpaRepository<ExpiredToken, String> {
}
