package com.hogares.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.hogares.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HogarTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Hogar.class);
        Hogar hogar1 = new Hogar();
        hogar1.setId("id1");
        Hogar hogar2 = new Hogar();
        hogar2.setId(hogar1.getId());
        assertThat(hogar1).isEqualTo(hogar2);
        hogar2.setId("id2");
        assertThat(hogar1).isNotEqualTo(hogar2);
        hogar1.setId(null);
        assertThat(hogar1).isNotEqualTo(hogar2);
    }
}
