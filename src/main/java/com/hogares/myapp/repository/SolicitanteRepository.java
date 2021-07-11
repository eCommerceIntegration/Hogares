package com.hogares.myapp.repository;

import com.hogares.myapp.domain.Solicitante;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Solicitante entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SolicitanteRepository extends MongoRepository<Solicitante, String> {}
