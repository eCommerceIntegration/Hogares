package com.hogares.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.hogares.myapp.IntegrationTest;
import com.hogares.myapp.domain.Solicitante;
import com.hogares.myapp.repository.SolicitanteRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link SolicitanteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SolicitanteResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final Instant DEFAULT_HIRE_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_HIRE_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_SALARY = 1L;
    private static final Long UPDATED_SALARY = 2L;

    private static final Long DEFAULT_COMMISSION_PCT = 1L;
    private static final Long UPDATED_COMMISSION_PCT = 2L;

    private static final String ENTITY_API_URL = "/api/solicitantes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private SolicitanteRepository solicitanteRepository;

    @Autowired
    private MockMvc restSolicitanteMockMvc;

    private Solicitante solicitante;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Solicitante createEntity() {
        Solicitante solicitante = new Solicitante()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .email(DEFAULT_EMAIL)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .hireDate(DEFAULT_HIRE_DATE)
            .salary(DEFAULT_SALARY)
            .commissionPct(DEFAULT_COMMISSION_PCT);
        return solicitante;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Solicitante createUpdatedEntity() {
        Solicitante solicitante = new Solicitante()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .hireDate(UPDATED_HIRE_DATE)
            .salary(UPDATED_SALARY)
            .commissionPct(UPDATED_COMMISSION_PCT);
        return solicitante;
    }

    @BeforeEach
    public void initTest() {
        solicitanteRepository.deleteAll();
        solicitante = createEntity();
    }

    @Test
    void createSolicitante() throws Exception {
        int databaseSizeBeforeCreate = solicitanteRepository.findAll().size();
        // Create the Solicitante
        restSolicitanteMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(solicitante))
            )
            .andExpect(status().isCreated());

        // Validate the Solicitante in the database
        List<Solicitante> solicitanteList = solicitanteRepository.findAll();
        assertThat(solicitanteList).hasSize(databaseSizeBeforeCreate + 1);
        Solicitante testSolicitante = solicitanteList.get(solicitanteList.size() - 1);
        assertThat(testSolicitante.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testSolicitante.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testSolicitante.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testSolicitante.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testSolicitante.getHireDate()).isEqualTo(DEFAULT_HIRE_DATE);
        assertThat(testSolicitante.getSalary()).isEqualTo(DEFAULT_SALARY);
        assertThat(testSolicitante.getCommissionPct()).isEqualTo(DEFAULT_COMMISSION_PCT);
    }

    @Test
    void createSolicitanteWithExistingId() throws Exception {
        // Create the Solicitante with an existing ID
        solicitante.setId("existing_id");

        int databaseSizeBeforeCreate = solicitanteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSolicitanteMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(solicitante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Solicitante in the database
        List<Solicitante> solicitanteList = solicitanteRepository.findAll();
        assertThat(solicitanteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllSolicitantes() throws Exception {
        // Initialize the database
        solicitanteRepository.save(solicitante);

        // Get all the solicitanteList
        restSolicitanteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(solicitante.getId())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)))
            .andExpect(jsonPath("$.[*].hireDate").value(hasItem(DEFAULT_HIRE_DATE.toString())))
            .andExpect(jsonPath("$.[*].salary").value(hasItem(DEFAULT_SALARY.intValue())))
            .andExpect(jsonPath("$.[*].commissionPct").value(hasItem(DEFAULT_COMMISSION_PCT.intValue())));
    }

    @Test
    void getSolicitante() throws Exception {
        // Initialize the database
        solicitanteRepository.save(solicitante);

        // Get the solicitante
        restSolicitanteMockMvc
            .perform(get(ENTITY_API_URL_ID, solicitante.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(solicitante.getId()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER))
            .andExpect(jsonPath("$.hireDate").value(DEFAULT_HIRE_DATE.toString()))
            .andExpect(jsonPath("$.salary").value(DEFAULT_SALARY.intValue()))
            .andExpect(jsonPath("$.commissionPct").value(DEFAULT_COMMISSION_PCT.intValue()));
    }

    @Test
    void getNonExistingSolicitante() throws Exception {
        // Get the solicitante
        restSolicitanteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewSolicitante() throws Exception {
        // Initialize the database
        solicitanteRepository.save(solicitante);

        int databaseSizeBeforeUpdate = solicitanteRepository.findAll().size();

        // Update the solicitante
        Solicitante updatedSolicitante = solicitanteRepository.findById(solicitante.getId()).get();
        updatedSolicitante
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .hireDate(UPDATED_HIRE_DATE)
            .salary(UPDATED_SALARY)
            .commissionPct(UPDATED_COMMISSION_PCT);

        restSolicitanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSolicitante.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSolicitante))
            )
            .andExpect(status().isOk());

        // Validate the Solicitante in the database
        List<Solicitante> solicitanteList = solicitanteRepository.findAll();
        assertThat(solicitanteList).hasSize(databaseSizeBeforeUpdate);
        Solicitante testSolicitante = solicitanteList.get(solicitanteList.size() - 1);
        assertThat(testSolicitante.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testSolicitante.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testSolicitante.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testSolicitante.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testSolicitante.getHireDate()).isEqualTo(UPDATED_HIRE_DATE);
        assertThat(testSolicitante.getSalary()).isEqualTo(UPDATED_SALARY);
        assertThat(testSolicitante.getCommissionPct()).isEqualTo(UPDATED_COMMISSION_PCT);
    }

    @Test
    void putNonExistingSolicitante() throws Exception {
        int databaseSizeBeforeUpdate = solicitanteRepository.findAll().size();
        solicitante.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSolicitanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, solicitante.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(solicitante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Solicitante in the database
        List<Solicitante> solicitanteList = solicitanteRepository.findAll();
        assertThat(solicitanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchSolicitante() throws Exception {
        int databaseSizeBeforeUpdate = solicitanteRepository.findAll().size();
        solicitante.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSolicitanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(solicitante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Solicitante in the database
        List<Solicitante> solicitanteList = solicitanteRepository.findAll();
        assertThat(solicitanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamSolicitante() throws Exception {
        int databaseSizeBeforeUpdate = solicitanteRepository.findAll().size();
        solicitante.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSolicitanteMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(solicitante))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Solicitante in the database
        List<Solicitante> solicitanteList = solicitanteRepository.findAll();
        assertThat(solicitanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateSolicitanteWithPatch() throws Exception {
        // Initialize the database
        solicitanteRepository.save(solicitante);

        int databaseSizeBeforeUpdate = solicitanteRepository.findAll().size();

        // Update the solicitante using partial update
        Solicitante partialUpdatedSolicitante = new Solicitante();
        partialUpdatedSolicitante.setId(solicitante.getId());

        partialUpdatedSolicitante
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .hireDate(UPDATED_HIRE_DATE)
            .commissionPct(UPDATED_COMMISSION_PCT);

        restSolicitanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSolicitante.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSolicitante))
            )
            .andExpect(status().isOk());

        // Validate the Solicitante in the database
        List<Solicitante> solicitanteList = solicitanteRepository.findAll();
        assertThat(solicitanteList).hasSize(databaseSizeBeforeUpdate);
        Solicitante testSolicitante = solicitanteList.get(solicitanteList.size() - 1);
        assertThat(testSolicitante.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testSolicitante.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testSolicitante.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testSolicitante.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testSolicitante.getHireDate()).isEqualTo(UPDATED_HIRE_DATE);
        assertThat(testSolicitante.getSalary()).isEqualTo(DEFAULT_SALARY);
        assertThat(testSolicitante.getCommissionPct()).isEqualTo(UPDATED_COMMISSION_PCT);
    }

    @Test
    void fullUpdateSolicitanteWithPatch() throws Exception {
        // Initialize the database
        solicitanteRepository.save(solicitante);

        int databaseSizeBeforeUpdate = solicitanteRepository.findAll().size();

        // Update the solicitante using partial update
        Solicitante partialUpdatedSolicitante = new Solicitante();
        partialUpdatedSolicitante.setId(solicitante.getId());

        partialUpdatedSolicitante
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .hireDate(UPDATED_HIRE_DATE)
            .salary(UPDATED_SALARY)
            .commissionPct(UPDATED_COMMISSION_PCT);

        restSolicitanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSolicitante.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSolicitante))
            )
            .andExpect(status().isOk());

        // Validate the Solicitante in the database
        List<Solicitante> solicitanteList = solicitanteRepository.findAll();
        assertThat(solicitanteList).hasSize(databaseSizeBeforeUpdate);
        Solicitante testSolicitante = solicitanteList.get(solicitanteList.size() - 1);
        assertThat(testSolicitante.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testSolicitante.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testSolicitante.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testSolicitante.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testSolicitante.getHireDate()).isEqualTo(UPDATED_HIRE_DATE);
        assertThat(testSolicitante.getSalary()).isEqualTo(UPDATED_SALARY);
        assertThat(testSolicitante.getCommissionPct()).isEqualTo(UPDATED_COMMISSION_PCT);
    }

    @Test
    void patchNonExistingSolicitante() throws Exception {
        int databaseSizeBeforeUpdate = solicitanteRepository.findAll().size();
        solicitante.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSolicitanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, solicitante.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(solicitante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Solicitante in the database
        List<Solicitante> solicitanteList = solicitanteRepository.findAll();
        assertThat(solicitanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchSolicitante() throws Exception {
        int databaseSizeBeforeUpdate = solicitanteRepository.findAll().size();
        solicitante.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSolicitanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(solicitante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Solicitante in the database
        List<Solicitante> solicitanteList = solicitanteRepository.findAll();
        assertThat(solicitanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamSolicitante() throws Exception {
        int databaseSizeBeforeUpdate = solicitanteRepository.findAll().size();
        solicitante.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSolicitanteMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(solicitante))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Solicitante in the database
        List<Solicitante> solicitanteList = solicitanteRepository.findAll();
        assertThat(solicitanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteSolicitante() throws Exception {
        // Initialize the database
        solicitanteRepository.save(solicitante);

        int databaseSizeBeforeDelete = solicitanteRepository.findAll().size();

        // Delete the solicitante
        restSolicitanteMockMvc
            .perform(delete(ENTITY_API_URL_ID, solicitante.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Solicitante> solicitanteList = solicitanteRepository.findAll();
        assertThat(solicitanteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
