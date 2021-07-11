package com.hogares.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.hogares.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SolicitanteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Solicitante.class);
        Solicitante solicitante1 = new Solicitante();
        solicitante1.setId("id1");
        Solicitante solicitante2 = new Solicitante();
        solicitante2.setId(solicitante1.getId());
        assertThat(solicitante1).isEqualTo(solicitante2);
        solicitante2.setId("id2");
        assertThat(solicitante1).isNotEqualTo(solicitante2);
        solicitante1.setId(null);
        assertThat(solicitante1).isNotEqualTo(solicitante2);
    }
}
