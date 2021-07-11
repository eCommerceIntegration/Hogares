package com.hogares.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.hogares.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AccionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Accion.class);
        Accion accion1 = new Accion();
        accion1.setId("id1");
        Accion accion2 = new Accion();
        accion2.setId(accion1.getId());
        assertThat(accion1).isEqualTo(accion2);
        accion2.setId("id2");
        assertThat(accion1).isNotEqualTo(accion2);
        accion1.setId(null);
        assertThat(accion1).isNotEqualTo(accion2);
    }
}
