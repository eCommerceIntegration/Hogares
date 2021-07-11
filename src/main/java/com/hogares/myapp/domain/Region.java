package com.hogares.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Region.
 */
@Document(collection = "region")
public class Region implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("region_name")
    private String regionName;

    @DBRef
    @Field("pais")
    @JsonIgnoreProperties(value = { "region" }, allowSetters = true)
    private Set<Pais> pais = new HashSet<>();

    @DBRef
    @Field("location")
    @JsonIgnoreProperties(value = { "regions", "hogar" }, allowSetters = true)
    private Location location;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Region id(String id) {
        this.id = id;
        return this;
    }

    public String getRegionName() {
        return this.regionName;
    }

    public Region regionName(String regionName) {
        this.regionName = regionName;
        return this;
    }

    public void setRegionName(String regionName) {
        this.regionName = regionName;
    }

    public Set<Pais> getPais() {
        return this.pais;
    }

    public Region pais(Set<Pais> pais) {
        this.setPais(pais);
        return this;
    }

    public Region addPais(Pais pais) {
        this.pais.add(pais);
        pais.setRegion(this);
        return this;
    }

    public Region removePais(Pais pais) {
        this.pais.remove(pais);
        pais.setRegion(null);
        return this;
    }

    public void setPais(Set<Pais> pais) {
        if (this.pais != null) {
            this.pais.forEach(i -> i.setRegion(null));
        }
        if (pais != null) {
            pais.forEach(i -> i.setRegion(this));
        }
        this.pais = pais;
    }

    public Location getLocation() {
        return this.location;
    }

    public Region location(Location location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Region)) {
            return false;
        }
        return id != null && id.equals(((Region) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Region{" +
            "id=" + getId() +
            ", regionName='" + getRegionName() + "'" +
            "}";
    }
}
