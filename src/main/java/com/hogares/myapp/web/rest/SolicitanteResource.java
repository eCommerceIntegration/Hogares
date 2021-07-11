package com.hogares.myapp.web.rest;

import com.hogares.myapp.domain.Solicitante;
import com.hogares.myapp.repository.SolicitanteRepository;
import com.hogares.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.hogares.myapp.domain.Solicitante}.
 */
@RestController
@RequestMapping("/api")
public class SolicitanteResource {

    private final Logger log = LoggerFactory.getLogger(SolicitanteResource.class);

    private static final String ENTITY_NAME = "solicitante";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SolicitanteRepository solicitanteRepository;

    public SolicitanteResource(SolicitanteRepository solicitanteRepository) {
        this.solicitanteRepository = solicitanteRepository;
    }

    /**
     * {@code POST  /solicitantes} : Create a new solicitante.
     *
     * @param solicitante the solicitante to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new solicitante, or with status {@code 400 (Bad Request)} if the solicitante has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/solicitantes")
    public ResponseEntity<Solicitante> createSolicitante(@RequestBody Solicitante solicitante) throws URISyntaxException {
        log.debug("REST request to save Solicitante : {}", solicitante);
        if (solicitante.getId() != null) {
            throw new BadRequestAlertException("A new solicitante cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Solicitante result = solicitanteRepository.save(solicitante);
        return ResponseEntity
            .created(new URI("/api/solicitantes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /solicitantes/:id} : Updates an existing solicitante.
     *
     * @param id the id of the solicitante to save.
     * @param solicitante the solicitante to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated solicitante,
     * or with status {@code 400 (Bad Request)} if the solicitante is not valid,
     * or with status {@code 500 (Internal Server Error)} if the solicitante couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/solicitantes/{id}")
    public ResponseEntity<Solicitante> updateSolicitante(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Solicitante solicitante
    ) throws URISyntaxException {
        log.debug("REST request to update Solicitante : {}, {}", id, solicitante);
        if (solicitante.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, solicitante.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!solicitanteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Solicitante result = solicitanteRepository.save(solicitante);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, solicitante.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /solicitantes/:id} : Partial updates given fields of an existing solicitante, field will ignore if it is null
     *
     * @param id the id of the solicitante to save.
     * @param solicitante the solicitante to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated solicitante,
     * or with status {@code 400 (Bad Request)} if the solicitante is not valid,
     * or with status {@code 404 (Not Found)} if the solicitante is not found,
     * or with status {@code 500 (Internal Server Error)} if the solicitante couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/solicitantes/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Solicitante> partialUpdateSolicitante(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Solicitante solicitante
    ) throws URISyntaxException {
        log.debug("REST request to partial update Solicitante partially : {}, {}", id, solicitante);
        if (solicitante.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, solicitante.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!solicitanteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Solicitante> result = solicitanteRepository
            .findById(solicitante.getId())
            .map(
                existingSolicitante -> {
                    if (solicitante.getFirstName() != null) {
                        existingSolicitante.setFirstName(solicitante.getFirstName());
                    }
                    if (solicitante.getLastName() != null) {
                        existingSolicitante.setLastName(solicitante.getLastName());
                    }
                    if (solicitante.getEmail() != null) {
                        existingSolicitante.setEmail(solicitante.getEmail());
                    }
                    if (solicitante.getPhoneNumber() != null) {
                        existingSolicitante.setPhoneNumber(solicitante.getPhoneNumber());
                    }
                    if (solicitante.getHireDate() != null) {
                        existingSolicitante.setHireDate(solicitante.getHireDate());
                    }
                    if (solicitante.getSalary() != null) {
                        existingSolicitante.setSalary(solicitante.getSalary());
                    }
                    if (solicitante.getCommissionPct() != null) {
                        existingSolicitante.setCommissionPct(solicitante.getCommissionPct());
                    }

                    return existingSolicitante;
                }
            )
            .map(solicitanteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, solicitante.getId())
        );
    }

    /**
     * {@code GET  /solicitantes} : get all the solicitantes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of solicitantes in body.
     */
    @GetMapping("/solicitantes")
    public List<Solicitante> getAllSolicitantes() {
        log.debug("REST request to get all Solicitantes");
        return solicitanteRepository.findAll();
    }

    /**
     * {@code GET  /solicitantes/:id} : get the "id" solicitante.
     *
     * @param id the id of the solicitante to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the solicitante, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/solicitantes/{id}")
    public ResponseEntity<Solicitante> getSolicitante(@PathVariable String id) {
        log.debug("REST request to get Solicitante : {}", id);
        Optional<Solicitante> solicitante = solicitanteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(solicitante);
    }

    /**
     * {@code DELETE  /solicitantes/:id} : delete the "id" solicitante.
     *
     * @param id the id of the solicitante to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/solicitantes/{id}")
    public ResponseEntity<Void> deleteSolicitante(@PathVariable String id) {
        log.debug("REST request to delete Solicitante : {}", id);
        solicitanteRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
