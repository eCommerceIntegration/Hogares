package com.hogares.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.hogares.myapp.IntegrationTest;
import com.hogares.myapp.domain.Trabajo;
import com.hogares.myapp.repository.TrabajoRepository;
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
 * Integration tests for the {@link TrabajoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TrabajoResourceIT {

    private static final String DEFAULT_TRABAJO_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TRABAJO_TITLE = "BBBBBBBBBB";

    private static final Long DEFAULT_MIN_SALARY = 1L;
    private static final Long UPDATED_MIN_SALARY = 2L;

    private static final Long DEFAULT_MAX_SALARY = 1L;
    private static final Long UPDATED_MAX_SALARY = 2L;

    private static final String ENTITY_API_URL = "/api/trabajos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private TrabajoRepository trabajoRepository;

    @Autowired
    private MockMvc restTrabajoMockMvc;

    private Trabajo trabajo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Trabajo createEntity() {
        Trabajo trabajo = new Trabajo().trabajoTitle(DEFAULT_TRABAJO_TITLE).minSalary(DEFAULT_MIN_SALARY).maxSalary(DEFAULT_MAX_SALARY);
        return trabajo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Trabajo createUpdatedEntity() {
        Trabajo trabajo = new Trabajo().trabajoTitle(UPDATED_TRABAJO_TITLE).minSalary(UPDATED_MIN_SALARY).maxSalary(UPDATED_MAX_SALARY);
        return trabajo;
    }

    @BeforeEach
    public void initTest() {
        trabajoRepository.deleteAll();
        trabajo = createEntity();
    }

    @Test
    void createTrabajo() throws Exception {
        int databaseSizeBeforeCreate = trabajoRepository.findAll().size();
        // Create the Trabajo
        restTrabajoMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(trabajo))
            )
            .andExpect(status().isCreated());

        // Validate the Trabajo in the database
        List<Trabajo> trabajoList = trabajoRepository.findAll();
        assertThat(trabajoList).hasSize(databaseSizeBeforeCreate + 1);
        Trabajo testTrabajo = trabajoList.get(trabajoList.size() - 1);
        assertThat(testTrabajo.getTrabajoTitle()).isEqualTo(DEFAULT_TRABAJO_TITLE);
        assertThat(testTrabajo.getMinSalary()).isEqualTo(DEFAULT_MIN_SALARY);
        assertThat(testTrabajo.getMaxSalary()).isEqualTo(DEFAULT_MAX_SALARY);
    }

    @Test
    void createTrabajoWithExistingId() throws Exception {
        // Create the Trabajo with an existing ID
        trabajo.setId("existing_id");

        int databaseSizeBeforeCreate = trabajoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTrabajoMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(trabajo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Trabajo in the database
        List<Trabajo> trabajoList = trabajoRepository.findAll();
        assertThat(trabajoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllTrabajos() throws Exception {
        // Initialize the database
        trabajoRepository.save(trabajo);

        // Get all the trabajoList
        restTrabajoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(trabajo.getId())))
            .andExpect(jsonPath("$.[*].trabajoTitle").value(hasItem(DEFAULT_TRABAJO_TITLE)))
            .andExpect(jsonPath("$.[*].minSalary").value(hasItem(DEFAULT_MIN_SALARY.intValue())))
            .andExpect(jsonPath("$.[*].maxSalary").value(hasItem(DEFAULT_MAX_SALARY.intValue())));
    }

    @Test
    void getTrabajo() throws Exception {
        // Initialize the database
        trabajoRepository.save(trabajo);

        // Get the trabajo
        restTrabajoMockMvc
            .perform(get(ENTITY_API_URL_ID, trabajo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(trabajo.getId()))
            .andExpect(jsonPath("$.trabajoTitle").value(DEFAULT_TRABAJO_TITLE))
            .andExpect(jsonPath("$.minSalary").value(DEFAULT_MIN_SALARY.intValue()))
            .andExpect(jsonPath("$.maxSalary").value(DEFAULT_MAX_SALARY.intValue()));
    }

    @Test
    void getNonExistingTrabajo() throws Exception {
        // Get the trabajo
        restTrabajoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewTrabajo() throws Exception {
        // Initialize the database
        trabajoRepository.save(trabajo);

        int databaseSizeBeforeUpdate = trabajoRepository.findAll().size();

        // Update the trabajo
        Trabajo updatedTrabajo = trabajoRepository.findById(trabajo.getId()).get();
        updatedTrabajo.trabajoTitle(UPDATED_TRABAJO_TITLE).minSalary(UPDATED_MIN_SALARY).maxSalary(UPDATED_MAX_SALARY);

        restTrabajoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTrabajo.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTrabajo))
            )
            .andExpect(status().isOk());

        // Validate the Trabajo in the database
        List<Trabajo> trabajoList = trabajoRepository.findAll();
        assertThat(trabajoList).hasSize(databaseSizeBeforeUpdate);
        Trabajo testTrabajo = trabajoList.get(trabajoList.size() - 1);
        assertThat(testTrabajo.getTrabajoTitle()).isEqualTo(UPDATED_TRABAJO_TITLE);
        assertThat(testTrabajo.getMinSalary()).isEqualTo(UPDATED_MIN_SALARY);
        assertThat(testTrabajo.getMaxSalary()).isEqualTo(UPDATED_MAX_SALARY);
    }

    @Test
    void putNonExistingTrabajo() throws Exception {
        int databaseSizeBeforeUpdate = trabajoRepository.findAll().size();
        trabajo.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTrabajoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, trabajo.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(trabajo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Trabajo in the database
        List<Trabajo> trabajoList = trabajoRepository.findAll();
        assertThat(trabajoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchTrabajo() throws Exception {
        int databaseSizeBeforeUpdate = trabajoRepository.findAll().size();
        trabajo.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrabajoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(trabajo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Trabajo in the database
        List<Trabajo> trabajoList = trabajoRepository.findAll();
        assertThat(trabajoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamTrabajo() throws Exception {
        int databaseSizeBeforeUpdate = trabajoRepository.findAll().size();
        trabajo.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrabajoMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trabajo))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Trabajo in the database
        List<Trabajo> trabajoList = trabajoRepository.findAll();
        assertThat(trabajoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateTrabajoWithPatch() throws Exception {
        // Initialize the database
        trabajoRepository.save(trabajo);

        int databaseSizeBeforeUpdate = trabajoRepository.findAll().size();

        // Update the trabajo using partial update
        Trabajo partialUpdatedTrabajo = new Trabajo();
        partialUpdatedTrabajo.setId(trabajo.getId());

        partialUpdatedTrabajo.trabajoTitle(UPDATED_TRABAJO_TITLE).maxSalary(UPDATED_MAX_SALARY);

        restTrabajoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTrabajo.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTrabajo))
            )
            .andExpect(status().isOk());

        // Validate the Trabajo in the database
        List<Trabajo> trabajoList = trabajoRepository.findAll();
        assertThat(trabajoList).hasSize(databaseSizeBeforeUpdate);
        Trabajo testTrabajo = trabajoList.get(trabajoList.size() - 1);
        assertThat(testTrabajo.getTrabajoTitle()).isEqualTo(UPDATED_TRABAJO_TITLE);
        assertThat(testTrabajo.getMinSalary()).isEqualTo(DEFAULT_MIN_SALARY);
        assertThat(testTrabajo.getMaxSalary()).isEqualTo(UPDATED_MAX_SALARY);
    }

    @Test
    void fullUpdateTrabajoWithPatch() throws Exception {
        // Initialize the database
        trabajoRepository.save(trabajo);

        int databaseSizeBeforeUpdate = trabajoRepository.findAll().size();

        // Update the trabajo using partial update
        Trabajo partialUpdatedTrabajo = new Trabajo();
        partialUpdatedTrabajo.setId(trabajo.getId());

        partialUpdatedTrabajo.trabajoTitle(UPDATED_TRABAJO_TITLE).minSalary(UPDATED_MIN_SALARY).maxSalary(UPDATED_MAX_SALARY);

        restTrabajoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTrabajo.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTrabajo))
            )
            .andExpect(status().isOk());

        // Validate the Trabajo in the database
        List<Trabajo> trabajoList = trabajoRepository.findAll();
        assertThat(trabajoList).hasSize(databaseSizeBeforeUpdate);
        Trabajo testTrabajo = trabajoList.get(trabajoList.size() - 1);
        assertThat(testTrabajo.getTrabajoTitle()).isEqualTo(UPDATED_TRABAJO_TITLE);
        assertThat(testTrabajo.getMinSalary()).isEqualTo(UPDATED_MIN_SALARY);
        assertThat(testTrabajo.getMaxSalary()).isEqualTo(UPDATED_MAX_SALARY);
    }

    @Test
    void patchNonExistingTrabajo() throws Exception {
        int databaseSizeBeforeUpdate = trabajoRepository.findAll().size();
        trabajo.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTrabajoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, trabajo.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(trabajo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Trabajo in the database
        List<Trabajo> trabajoList = trabajoRepository.findAll();
        assertThat(trabajoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchTrabajo() throws Exception {
        int databaseSizeBeforeUpdate = trabajoRepository.findAll().size();
        trabajo.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrabajoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(trabajo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Trabajo in the database
        List<Trabajo> trabajoList = trabajoRepository.findAll();
        assertThat(trabajoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamTrabajo() throws Exception {
        int databaseSizeBeforeUpdate = trabajoRepository.findAll().size();
        trabajo.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrabajoMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(trabajo))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Trabajo in the database
        List<Trabajo> trabajoList = trabajoRepository.findAll();
        assertThat(trabajoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteTrabajo() throws Exception {
        // Initialize the database
        trabajoRepository.save(trabajo);

        int databaseSizeBeforeDelete = trabajoRepository.findAll().size();

        // Delete the trabajo
        restTrabajoMockMvc
            .perform(delete(ENTITY_API_URL_ID, trabajo.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Trabajo> trabajoList = trabajoRepository.findAll();
        assertThat(trabajoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
