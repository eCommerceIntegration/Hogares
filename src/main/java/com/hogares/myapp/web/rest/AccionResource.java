package com.hogares.myapp.web.rest;

import com.hogares.myapp.domain.Accion;
import com.hogares.myapp.repository.AccionRepository;
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
 * REST controller for managing {@link com.hogares.myapp.domain.Accion}.
 */
@RestController
@RequestMapping("/api")
public class AccionResource {

    private final Logger log = LoggerFactory.getLogger(AccionResource.class);

    private static final String ENTITY_NAME = "accion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AccionRepository accionRepository;

    public AccionResource(AccionRepository accionRepository) {
        this.accionRepository = accionRepository;
    }

    /**
     * {@code POST  /accions} : Create a new accion.
     *
     * @param accion the accion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new accion, or with status {@code 400 (Bad Request)} if the accion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/accions")
    public ResponseEntity<Accion> createAccion(@RequestBody Accion accion) throws URISyntaxException {
        log.debug("REST request to save Accion : {}", accion);
        if (accion.getId() != null) {
            throw new BadRequestAlertException("A new accion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Accion result = accionRepository.save(accion);
        return ResponseEntity
            .created(new URI("/api/accions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /accions/:id} : Updates an existing accion.
     *
     * @param id the id of the accion to save.
     * @param accion the accion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accion,
     * or with status {@code 400 (Bad Request)} if the accion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the accion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/accions/{id}")
    public ResponseEntity<Accion> updateAccion(@PathVariable(value = "id", required = false) final String id, @RequestBody Accion accion)
        throws URISyntaxException {
        log.debug("REST request to update Accion : {}, {}", id, accion);
        if (accion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Accion result = accionRepository.save(accion);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accion.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /accions/:id} : Partial updates given fields of an existing accion, field will ignore if it is null
     *
     * @param id the id of the accion to save.
     * @param accion the accion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accion,
     * or with status {@code 400 (Bad Request)} if the accion is not valid,
     * or with status {@code 404 (Not Found)} if the accion is not found,
     * or with status {@code 500 (Internal Server Error)} if the accion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/accions/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Accion> partialUpdateAccion(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Accion accion
    ) throws URISyntaxException {
        log.debug("REST request to partial update Accion partially : {}, {}", id, accion);
        if (accion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Accion> result = accionRepository
            .findById(accion.getId())
            .map(
                existingAccion -> {
                    if (accion.getTitle() != null) {
                        existingAccion.setTitle(accion.getTitle());
                    }
                    if (accion.getDescription() != null) {
                        existingAccion.setDescription(accion.getDescription());
                    }

                    return existingAccion;
                }
            )
            .map(accionRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accion.getId()));
    }

    /**
     * {@code GET  /accions} : get all the accions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of accions in body.
     */
    @GetMapping("/accions")
    public List<Accion> getAllAccions() {
        log.debug("REST request to get all Accions");
        return accionRepository.findAll();
    }

    /**
     * {@code GET  /accions/:id} : get the "id" accion.
     *
     * @param id the id of the accion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the accion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/accions/{id}")
    public ResponseEntity<Accion> getAccion(@PathVariable String id) {
        log.debug("REST request to get Accion : {}", id);
        Optional<Accion> accion = accionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(accion);
    }

    /**
     * {@code DELETE  /accions/:id} : delete the "id" accion.
     *
     * @param id the id of the accion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/accions/{id}")
    public ResponseEntity<Void> deleteAccion(@PathVariable String id) {
        log.debug("REST request to delete Accion : {}", id);
        accionRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
