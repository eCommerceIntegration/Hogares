package com.hogares.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.hogares.myapp.IntegrationTest;
import com.hogares.myapp.domain.Accion;
import com.hogares.myapp.repository.AccionRepository;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link AccionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AccionResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/accions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private AccionRepository accionRepository;

    @Autowired
    private MockMvc restAccionMockMvc;

    private Accion accion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Accion createEntity() {
        Accion accion = new Accion().title(DEFAULT_TITLE).description(DEFAULT_DESCRIPTION);
        return accion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Accion createUpdatedEntity() {
        Accion accion = new Accion().title(UPDATED_TITLE).description(UPDATED_DESCRIPTION);
        return accion;
    }

    @BeforeEach
    public void initTest() {
        accionRepository.deleteAll();
        accion = createEntity();
    }

    @Test
    void createAccion() throws Exception {
        int databaseSizeBeforeCreate = accionRepository.findAll().size();
        // Create the Accion
        restAccionMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accion))
            )
            .andExpect(status().isCreated());

        // Validate the Accion in the database
        List<Accion> accionList = accionRepository.findAll();
        assertThat(accionList).hasSize(databaseSizeBeforeCreate + 1);
        Accion testAccion = accionList.get(accionList.size() - 1);
        assertThat(testAccion.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testAccion.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    void createAccionWithExistingId() throws Exception {
        // Create the Accion with an existing ID
        accion.setId("existing_id");

        int databaseSizeBeforeCreate = accionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAccionMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Accion in the database
        List<Accion> accionList = accionRepository.findAll();
        assertThat(accionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllAccions() throws Exception {
        // Initialize the database
        accionRepository.save(accion);

        // Get all the accionList
        restAccionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(accion.getId())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    void getAccion() throws Exception {
        // Initialize the database
        accionRepository.save(accion);

        // Get the accion
        restAccionMockMvc
            .perform(get(ENTITY_API_URL_ID, accion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(accion.getId()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    void getNonExistingAccion() throws Exception {
        // Get the accion
        restAccionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewAccion() throws Exception {
        // Initialize the database
        accionRepository.save(accion);

        int databaseSizeBeforeUpdate = accionRepository.findAll().size();

        // Update the accion
        Accion updatedAccion = accionRepository.findById(accion.getId()).get();
        updatedAccion.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION);

        restAccionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAccion.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAccion))
            )
            .andExpect(status().isOk());

        // Validate the Accion in the database
        List<Accion> accionList = accionRepository.findAll();
        assertThat(accionList).hasSize(databaseSizeBeforeUpdate);
        Accion testAccion = accionList.get(accionList.size() - 1);
        assertThat(testAccion.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testAccion.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    void putNonExistingAccion() throws Exception {
        int databaseSizeBeforeUpdate = accionRepository.findAll().size();
        accion.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, accion.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Accion in the database
        List<Accion> accionList = accionRepository.findAll();
        assertThat(accionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchAccion() throws Exception {
        int databaseSizeBeforeUpdate = accionRepository.findAll().size();
        accion.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Accion in the database
        List<Accion> accionList = accionRepository.findAll();
        assertThat(accionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamAccion() throws Exception {
        int databaseSizeBeforeUpdate = accionRepository.findAll().size();
        accion.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccionMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Accion in the database
        List<Accion> accionList = accionRepository.findAll();
        assertThat(accionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateAccionWithPatch() throws Exception {
        // Initialize the database
        accionRepository.save(accion);

        int databaseSizeBeforeUpdate = accionRepository.findAll().size();

        // Update the accion using partial update
        Accion partialUpdatedAccion = new Accion();
        partialUpdatedAccion.setId(accion.getId());

        partialUpdatedAccion.title(UPDATED_TITLE);

        restAccionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccion.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAccion))
            )
            .andExpect(status().isOk());

        // Validate the Accion in the database
        List<Accion> accionList = accionRepository.findAll();
        assertThat(accionList).hasSize(databaseSizeBeforeUpdate);
        Accion testAccion = accionList.get(accionList.size() - 1);
        assertThat(testAccion.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testAccion.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    void fullUpdateAccionWithPatch() throws Exception {
        // Initialize the database
        accionRepository.save(accion);

        int databaseSizeBeforeUpdate = accionRepository.findAll().size();

        // Update the accion using partial update
        Accion partialUpdatedAccion = new Accion();
        partialUpdatedAccion.setId(accion.getId());

        partialUpdatedAccion.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION);

        restAccionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccion.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAccion))
            )
            .andExpect(status().isOk());

        // Validate the Accion in the database
        List<Accion> accionList = accionRepository.findAll();
        assertThat(accionList).hasSize(databaseSizeBeforeUpdate);
        Accion testAccion = accionList.get(accionList.size() - 1);
        assertThat(testAccion.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testAccion.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    void patchNonExistingAccion() throws Exception {
        int databaseSizeBeforeUpdate = accionRepository.findAll().size();
        accion.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, accion.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Accion in the database
        List<Accion> accionList = accionRepository.findAll();
        assertThat(accionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchAccion() throws Exception {
        int databaseSizeBeforeUpdate = accionRepository.findAll().size();
        accion.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Accion in the database
        List<Accion> accionList = accionRepository.findAll();
        assertThat(accionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamAccion() throws Exception {
        int databaseSizeBeforeUpdate = accionRepository.findAll().size();
        accion.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Accion in the database
        List<Accion> accionList = accionRepository.findAll();
        assertThat(accionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteAccion() throws Exception {
        // Initialize the database
        accionRepository.save(accion);

        int databaseSizeBeforeDelete = accionRepository.findAll().size();

        // Delete the accion
        restAccionMockMvc
            .perform(delete(ENTITY_API_URL_ID, accion.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Accion> accionList = accionRepository.findAll();
        assertThat(accionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
