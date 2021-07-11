package com.hogares.myapp.web.rest;

import com.hogares.myapp.domain.Hogar;
import com.hogares.myapp.repository.HogarRepository;
import com.hogares.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.hogares.myapp.domain.Hogar}.
 */
@RestController
@RequestMapping("/api")
public class HogarResource {

    private final Logger log = LoggerFactory.getLogger(HogarResource.class);

    private static final String ENTITY_NAME = "hogar";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HogarRepository hogarRepository;

    public HogarResource(HogarRepository hogarRepository) {
        this.hogarRepository = hogarRepository;
    }

    /**
     * {@code POST  /hogars} : Create a new hogar.
     *
     * @param hogar the hogar to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new hogar, or with status {@code 400 (Bad Request)} if the hogar has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/hogars")
    public ResponseEntity<Hogar> createHogar(@Valid @RequestBody Hogar hogar) throws URISyntaxException {
        log.debug("REST request to save Hogar : {}", hogar);
        if (hogar.getId() != null) {
            throw new BadRequestAlertException("A new hogar cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Hogar result = hogarRepository.save(hogar);
        return ResponseEntity
            .created(new URI("/api/hogars/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /hogars/:id} : Updates an existing hogar.
     *
     * @param id the id of the hogar to save.
     * @param hogar the hogar to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated hogar,
     * or with status {@code 400 (Bad Request)} if the hogar is not valid,
     * or with status {@code 500 (Internal Server Error)} if the hogar couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/hogars/{id}")
    public ResponseEntity<Hogar> updateHogar(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody Hogar hogar
    ) throws URISyntaxException {
        log.debug("REST request to update Hogar : {}, {}", id, hogar);
        if (hogar.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, hogar.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!hogarRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Hogar result = hogarRepository.save(hogar);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, hogar.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /hogars/:id} : Partial updates given fields of an existing hogar, field will ignore if it is null
     *
     * @param id the id of the hogar to save.
     * @param hogar the hogar to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated hogar,
     * or with status {@code 400 (Bad Request)} if the hogar is not valid,
     * or with status {@code 404 (Not Found)} if the hogar is not found,
     * or with status {@code 500 (Internal Server Error)} if the hogar couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/hogars/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Hogar> partialUpdateHogar(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody Hogar hogar
    ) throws URISyntaxException {
        log.debug("REST request to partial update Hogar partially : {}, {}", id, hogar);
        if (hogar.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, hogar.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!hogarRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Hogar> result = hogarRepository
            .findById(hogar.getId())
            .map(
                existingHogar -> {
                    if (hogar.getHogarName() != null) {
                        existingHogar.setHogarName(hogar.getHogarName());
                    }
                    if (hogar.getLanguage() != null) {
                        existingHogar.setLanguage(hogar.getLanguage());
                    }

                    return existingHogar;
                }
            )
            .map(hogarRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, hogar.getId()));
    }

    /**
     * {@code GET  /hogars} : get all the hogars.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of hogars in body.
     */
    @GetMapping("/hogars")
    public List<Hogar> getAllHogars() {
        log.debug("REST request to get all Hogars");
        return hogarRepository.findAll();
    }

    /**
     * {@code GET  /hogars/:id} : get the "id" hogar.
     *
     * @param id the id of the hogar to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the hogar, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/hogars/{id}")
    public ResponseEntity<Hogar> getHogar(@PathVariable String id) {
        log.debug("REST request to get Hogar : {}", id);
        Optional<Hogar> hogar = hogarRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(hogar);
    }

    /**
     * {@code DELETE  /hogars/:id} : delete the "id" hogar.
     *
     * @param id the id of the hogar to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/hogars/{id}")
    public ResponseEntity<Void> deleteHogar(@PathVariable String id) {
        log.debug("REST request to delete Hogar : {}", id);
        hogarRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
