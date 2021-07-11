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
 * A Location.
 */
@Document(collection = "location")
public class Location implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("street_address")
    private String streetAddress;

    @Field("postal_code")
    private String postalCode;

    @Field("city")
    private String city;

    @Field("state_province")
    private String stateProvince;

    @DBRef
    @Field("region")
    @JsonIgnoreProperties(value = { "pais", "location" }, allowSetters = true)
    private Set<Region> regions = new HashSet<>();

    @DBRef
    @Field("hogar")
    @JsonIgnoreProperties(value = { "empleados", "locations", "solicitantes" }, allowSetters = true)
    private Hogar hogar;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Location id(String id) {
        this.id = id;
        return this;
    }

    public String getStreetAddress() {
        return this.streetAddress;
    }

    public Location streetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
        return this;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getPostalCode() {
        return this.postalCode;
    }

    public Location postalCode(String postalCode) {
        this.postalCode = postalCode;
        return this;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCity() {
        return this.city;
    }

    public Location city(String city) {
        this.city = city;
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStateProvince() {
        return this.stateProvince;
    }

    public Location stateProvince(String stateProvince) {
        this.stateProvince = stateProvince;
        return this;
    }

    public void setStateProvince(String stateProvince) {
        this.stateProvince = stateProvince;
    }

    public Set<Region> getRegions() {
        return this.regions;
    }

    public Location regions(Set<Region> regions) {
        this.setRegions(regions);
        return this;
    }

    public Location addRegion(Region region) {
        this.regions.add(region);
        region.setLocation(this);
        return this;
    }

    public Location removeRegion(Region region) {
        this.regions.remove(region);
        region.setLocation(null);
        return this;
    }

    public void setRegions(Set<Region> regions) {
        if (this.regions != null) {
            this.regions.forEach(i -> i.setLocation(null));
        }
        if (regions != null) {
            regions.forEach(i -> i.setLocation(this));
        }
        this.regions = regions;
    }

    public Hogar getHogar() {
        return this.hogar;
    }

    public Location hogar(Hogar hogar) {
        this.setHogar(hogar);
        return this;
    }

    public void setHogar(Hogar hogar) {
        this.hogar = hogar;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Location)) {
            return false;
        }
        return id != null && id.equals(((Location) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Location{" +
            "id=" + getId() +
            ", streetAddress='" + getStreetAddress() + "'" +
            ", postalCode='" + getPostalCode() + "'" +
            ", city='" + getCity() + "'" +
            ", stateProvince='" + getStateProvince() + "'" +
            "}";
    }
}
