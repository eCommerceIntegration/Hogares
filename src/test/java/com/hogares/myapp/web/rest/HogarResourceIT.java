package com.hogares.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.hogares.myapp.IntegrationTest;
import com.hogares.myapp.domain.Hogar;
import com.hogares.myapp.domain.enumeration.Language;
import com.hogares.myapp.repository.HogarRepository;
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
 * Integration tests for the {@link HogarResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class HogarResourceIT {

    private static final String DEFAULT_HOGAR_NAME = "AAAAAAAAAA";
    private static final String UPDATED_HOGAR_NAME = "BBBBBBBBBB";

    private static final Language DEFAULT_LANGUAGE = Language.PORTUGUES;
    private static final Language UPDATED_LANGUAGE = Language.ENGLISH;

    private static final String ENTITY_API_URL = "/api/hogars";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private HogarRepository hogarRepository;

    @Autowired
    private MockMvc restHogarMockMvc;

    private Hogar hogar;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Hogar createEntity() {
        Hogar hogar = new Hogar().hogarName(DEFAULT_HOGAR_NAME).language(DEFAULT_LANGUAGE);
        return hogar;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Hogar createUpdatedEntity() {
        Hogar hogar = new Hogar().hogarName(UPDATED_HOGAR_NAME).language(UPDATED_LANGUAGE);
        return hogar;
    }

    @BeforeEach
    public void initTest() {
        hogarRepository.deleteAll();
        hogar = createEntity();
    }

    @Test
    void createHogar() throws Exception {
        int databaseSizeBeforeCreate = hogarRepository.findAll().size();
        // Create the Hogar
        restHogarMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(hogar))
            )
            .andExpect(status().isCreated());

        // Validate the Hogar in the database
        List<Hogar> hogarList = hogarRepository.findAll();
        assertThat(hogarList).hasSize(databaseSizeBeforeCreate + 1);
        Hogar testHogar = hogarList.get(hogarList.size() - 1);
        assertThat(testHogar.getHogarName()).isEqualTo(DEFAULT_HOGAR_NAME);
        assertThat(testHogar.getLanguage()).isEqualTo(DEFAULT_LANGUAGE);
    }

    @Test
    void createHogarWithExistingId() throws Exception {
        // Create the Hogar with an existing ID
        hogar.setId("existing_id");

        int databaseSizeBeforeCreate = hogarRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHogarMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(hogar))
            )
            .andExpect(status().isBadRequest());

        // Validate the Hogar in the database
        List<Hogar> hogarList = hogarRepository.findAll();
        assertThat(hogarList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkHogarNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = hogarRepository.findAll().size();
        // set the field null
        hogar.setHogarName(null);

        // Create the Hogar, which fails.

        restHogarMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(hogar))
            )
            .andExpect(status().isBadRequest());

        List<Hogar> hogarList = hogarRepository.findAll();
        assertThat(hogarList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllHogars() throws Exception {
        // Initialize the database
        hogarRepository.save(hogar);

        // Get all the hogarList
        restHogarMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(hogar.getId())))
            .andExpect(jsonPath("$.[*].hogarName").value(hasItem(DEFAULT_HOGAR_NAME)))
            .andExpect(jsonPath("$.[*].language").value(hasItem(DEFAULT_LANGUAGE.toString())));
    }

    @Test
    void getHogar() throws Exception {
        // Initialize the database
        hogarRepository.save(hogar);

        // Get the hogar
        restHogarMockMvc
            .perform(get(ENTITY_API_URL_ID, hogar.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(hogar.getId()))
            .andExpect(jsonPath("$.hogarName").value(DEFAULT_HOGAR_NAME))
            .andExpect(jsonPath("$.language").value(DEFAULT_LANGUAGE.toString()));
    }

    @Test
    void getNonExistingHogar() throws Exception {
        // Get the hogar
        restHogarMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewHogar() throws Exception {
        // Initialize the database
        hogarRepository.save(hogar);

        int databaseSizeBeforeUpdate = hogarRepository.findAll().size();

        // Update the hogar
        Hogar updatedHogar = hogarRepository.findById(hogar.getId()).get();
        updatedHogar.hogarName(UPDATED_HOGAR_NAME).language(UPDATED_LANGUAGE);

        restHogarMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedHogar.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedHogar))
            )
            .andExpect(status().isOk());

        // Validate the Hogar in the database
        List<Hogar> hogarList = hogarRepository.findAll();
        assertThat(hogarList).hasSize(databaseSizeBeforeUpdate);
        Hogar testHogar = hogarList.get(hogarList.size() - 1);
        assertThat(testHogar.getHogarName()).isEqualTo(UPDATED_HOGAR_NAME);
        assertThat(testHogar.getLanguage()).isEqualTo(UPDATED_LANGUAGE);
    }

    @Test
    void putNonExistingHogar() throws Exception {
        int databaseSizeBeforeUpdate = hogarRepository.findAll().size();
        hogar.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHogarMockMvc
            .perform(
                put(ENTITY_API_URL_ID, hogar.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(hogar))
            )
            .andExpect(status().isBadRequest());

        // Validate the Hogar in the database
        List<Hogar> hogarList = hogarRepository.findAll();
        assertThat(hogarList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchHogar() throws Exception {
        int databaseSizeBeforeUpdate = hogarRepository.findAll().size();
        hogar.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHogarMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(hogar))
            )
            .andExpect(status().isBadRequest());

        // Validate the Hogar in the database
        List<Hogar> hogarList = hogarRepository.findAll();
        assertThat(hogarList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamHogar() throws Exception {
        int databaseSizeBeforeUpdate = hogarRepository.findAll().size();
        hogar.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHogarMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(hogar))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Hogar in the database
        List<Hogar> hogarList = hogarRepository.findAll();
        assertThat(hogarList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateHogarWithPatch() throws Exception {
        // Initialize the database
        hogarRepository.save(hogar);

        int databaseSizeBeforeUpdate = hogarRepository.findAll().size();

        // Update the hogar using partial update
        Hogar partialUpdatedHogar = new Hogar();
        partialUpdatedHogar.setId(hogar.getId());

        partialUpdatedHogar.hogarName(UPDATED_HOGAR_NAME);

        restHogarMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHogar.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHogar))
            )
            .andExpect(status().isOk());

        // Validate the Hogar in the database
        List<Hogar> hogarList = hogarRepository.findAll();
        assertThat(hogarList).hasSize(databaseSizeBeforeUpdate);
        Hogar testHogar = hogarList.get(hogarList.size() - 1);
        assertThat(testHogar.getHogarName()).isEqualTo(UPDATED_HOGAR_NAME);
        assertThat(testHogar.getLanguage()).isEqualTo(DEFAULT_LANGUAGE);
    }

    @Test
    void fullUpdateHogarWithPatch() throws Exception {
        // Initialize the database
        hogarRepository.save(hogar);

        int databaseSizeBeforeUpdate = hogarRepository.findAll().size();

        // Update the hogar using partial update
        Hogar partialUpdatedHogar = new Hogar();
        partialUpdatedHogar.setId(hogar.getId());

        partialUpdatedHogar.hogarName(UPDATED_HOGAR_NAME).language(UPDATED_LANGUAGE);

        restHogarMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHogar.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHogar))
            )
            .andExpect(status().isOk());

        // Validate the Hogar in the database
        List<Hogar> hogarList = hogarRepository.findAll();
        assertThat(hogarList).hasSize(databaseSizeBeforeUpdate);
        Hogar testHogar = hogarList.get(hogarList.size() - 1);
        assertThat(testHogar.getHogarName()).isEqualTo(UPDATED_HOGAR_NAME);
        assertThat(testHogar.getLanguage()).isEqualTo(UPDATED_LANGUAGE);
    }

    @Test
    void patchNonExistingHogar() throws Exception {
        int databaseSizeBeforeUpdate = hogarRepository.findAll().size();
        hogar.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHogarMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, hogar.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(hogar))
            )
            .andExpect(status().isBadRequest());

        // Validate the Hogar in the database
        List<Hogar> hogarList = hogarRepository.findAll();
        assertThat(hogarList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchHogar() throws Exception {
        int databaseSizeBeforeUpdate = hogarRepository.findAll().size();
        hogar.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHogarMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(hogar))
            )
            .andExpect(status().isBadRequest());

        // Validate the Hogar in the database
        List<Hogar> hogarList = hogarRepository.findAll();
        assertThat(hogarList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamHogar() throws Exception {
        int databaseSizeBeforeUpdate = hogarRepository.findAll().size();
        hogar.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHogarMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(hogar))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Hogar in the database
        List<Hogar> hogarList = hogarRepository.findAll();
        assertThat(hogarList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteHogar() throws Exception {
        // Initialize the database
        hogarRepository.save(hogar);

        int databaseSizeBeforeDelete = hogarRepository.findAll().size();

        // Delete the hogar
        restHogarMockMvc
            .perform(delete(ENTITY_API_URL_ID, hogar.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Hogar> hogarList = hogarRepository.findAll();
        assertThat(hogarList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
