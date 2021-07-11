package com.hogares.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hogares.myapp.domain.enumeration.Language;
import io.swagger.annotations.ApiModel;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * not an ignored comment
 */
@ApiModel(description = "not an ignored comment")
@Document(collection = "hogar")
public class Hogar implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("hogar_name")
    private String hogarName;

    @Field("language")
    private Language language;

    @DBRef
    @Field("empleado")
    @JsonIgnoreProperties(value = { "trabajos", "hogar" }, allowSetters = true)
    private Set<Empleado> empleados = new HashSet<>();

    @DBRef
    @Field("location")
    @JsonIgnoreProperties(value = { "regions", "hogar" }, allowSetters = true)
    private Set<Location> locations = new HashSet<>();

    @DBRef
    @Field("solicitante")
    @JsonIgnoreProperties(value = { "servicios", "hogar" }, allowSetters = true)
    private Set<Solicitante> solicitantes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Hogar id(String id) {
        this.id = id;
        return this;
    }

    public String getHogarName() {
        return this.hogarName;
    }

    public Hogar hogarName(String hogarName) {
        this.hogarName = hogarName;
        return this;
    }

    public void setHogarName(String hogarName) {
        this.hogarName = hogarName;
    }

    public Language getLanguage() {
        return this.language;
    }

    public Hogar language(Language language) {
        this.language = language;
        return this;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public Set<Empleado> getEmpleados() {
        return this.empleados;
    }

    public Hogar empleados(Set<Empleado> empleados) {
        this.setEmpleados(empleados);
        return this;
    }

    public Hogar addEmpleado(Empleado empleado) {
        this.empleados.add(empleado);
        empleado.setHogar(this);
        return this;
    }

    public Hogar removeEmpleado(Empleado empleado) {
        this.empleados.remove(empleado);
        empleado.setHogar(null);
        return this;
    }

    public void setEmpleados(Set<Empleado> empleados) {
        if (this.empleados != null) {
            this.empleados.forEach(i -> i.setHogar(null));
        }
        if (empleados != null) {
            empleados.forEach(i -> i.setHogar(this));
        }
        this.empleados = empleados;
    }

    public Set<Location> getLocations() {
        return this.locations;
    }

    public Hogar locations(Set<Location> locations) {
        this.setLocations(locations);
        return this;
    }

    public Hogar addLocation(Location location) {
        this.locations.add(location);
        location.setHogar(this);
        return this;
    }

    public Hogar removeLocation(Location location) {
        this.locations.remove(location);
        location.setHogar(null);
        return this;
    }

    public void setLocations(Set<Location> locations) {
        if (this.locations != null) {
            this.locations.forEach(i -> i.setHogar(null));
        }
        if (locations != null) {
            locations.forEach(i -> i.setHogar(this));
        }
        this.locations = locations;
    }

    public Set<Solicitante> getSolicitantes() {
        return this.solicitantes;
    }

    public Hogar solicitantes(Set<Solicitante> solicitantes) {
        this.setSolicitantes(solicitantes);
        return this;
    }

    public Hogar addSolicitante(Solicitante solicitante) {
        this.solicitantes.add(solicitante);
        solicitante.setHogar(this);
        return this;
    }

    public Hogar removeSolicitante(Solicitante solicitante) {
        this.solicitantes.remove(solicitante);
        solicitante.setHogar(null);
        return this;
    }

    public void setSolicitantes(Set<Solicitante> solicitantes) {
        if (this.solicitantes != null) {
            this.solicitantes.forEach(i -> i.setHogar(null));
        }
        if (solicitantes != null) {
            solicitantes.forEach(i -> i.setHogar(this));
        }
        this.solicitantes = solicitantes;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Hogar)) {
            return false;
        }
        return id != null && id.equals(((Hogar) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Hogar{" +
            "id=" + getId() +
            ", hogarName='" + getHogarName() + "'" +
            ", language='" + getLanguage() + "'" +
            "}";
    }
}
