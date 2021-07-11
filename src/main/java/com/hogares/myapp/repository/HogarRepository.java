package com.hogares.myapp.repository;

import com.hogares.myapp.domain.Hogar;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Hogar entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HogarRepository extends MongoRepository<Hogar, String> {}
