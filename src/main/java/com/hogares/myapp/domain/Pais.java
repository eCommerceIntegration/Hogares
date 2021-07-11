package com.hogares.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Pais.
 */
@Document(collection = "pais")
public class Pais implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("pais_name")
    private String paisName;

    @DBRef
    @Field("region")
    @JsonIgnoreProperties(value = { "pais", "location" }, allowSetters = true)
    private Region region;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Pais id(String id) {
        this.id = id;
        return this;
    }

    public String getPaisName() {
        return this.paisName;
    }

    public Pais paisName(String paisName) {
        this.paisName = paisName;
        return this;
    }

    public void setPaisName(String paisName) {
        this.paisName = paisName;
    }

    public Region getRegion() {
        return this.region;
    }

    public Pais region(Region region) {
        this.setRegion(region);
        return this;
    }

    public void setRegion(Region region) {
        this.region = region;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pais)) {
            return false;
        }
        return id != null && id.equals(((Pais) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pais{" +
            "id=" + getId() +
            ", paisName='" + getPaisName() + "'" +
            "}";
    }
}
