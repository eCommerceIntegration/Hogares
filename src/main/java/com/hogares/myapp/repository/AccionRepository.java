package com.hogares.myapp.repository;

import com.hogares.myapp.domain.Accion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Accion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AccionRepository extends MongoRepository<Accion, String> {}
