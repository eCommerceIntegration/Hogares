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
 * A Servicio.
 */
@Document(collection = "servicio")
public class Servicio implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("servicio_title")
    private String servicioTitle;

    @Field("min_salary")
    private Long minSalary;

    @Field("max_salary")
    private Long maxSalary;

    @DBRef
    @Field("accion")
    @JsonIgnoreProperties(value = { "servicio" }, allowSetters = true)
    private Set<Accion> accions = new HashSet<>();

    @DBRef
    @Field("solicitante")
    @JsonIgnoreProperties(value = { "servicios", "hogar" }, allowSetters = true)
    private Solicitante solicitante;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Servicio id(String id) {
        this.id = id;
        return this;
    }

    public String getServicioTitle() {
        return this.servicioTitle;
    }

    public Servicio servicioTitle(String servicioTitle) {
        this.servicioTitle = servicioTitle;
        return this;
    }

    public void setServicioTitle(String servicioTitle) {
        this.servicioTitle = servicioTitle;
    }

    public Long getMinSalary() {
        return this.minSalary;
    }

    public Servicio minSalary(Long minSalary) {
        this.minSalary = minSalary;
        return this;
    }

    public void setMinSalary(Long minSalary) {
        this.minSalary = minSalary;
    }

    public Long getMaxSalary() {
        return this.maxSalary;
    }

    public Servicio maxSalary(Long maxSalary) {
        this.maxSalary = maxSalary;
        return this;
    }

    public void setMaxSalary(Long maxSalary) {
        this.maxSalary = maxSalary;
    }

    public Set<Accion> getAccions() {
        return this.accions;
    }

    public Servicio accions(Set<Accion> accions) {
        this.setAccions(accions);
        return this;
    }

    public Servicio addAccion(Accion accion) {
        this.accions.add(accion);
        accion.setServicio(this);
        return this;
    }

    public Servicio removeAccion(Accion accion) {
        this.accions.remove(accion);
        accion.setServicio(null);
        return this;
    }

    public void setAccions(Set<Accion> accions) {
        if (this.accions != null) {
            this.accions.forEach(i -> i.setServicio(null));
        }
        if (accions != null) {
            accions.forEach(i -> i.setServicio(this));
        }
        this.accions = accions;
    }

    public Solicitante getSolicitante() {
        return this.solicitante;
    }

    public Servicio solicitante(Solicitante solicitante) {
        this.setSolicitante(solicitante);
        return this;
    }

    public void setSolicitante(Solicitante solicitante) {
        this.solicitante = solicitante;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Servicio)) {
            return false;
        }
        return id != null && id.equals(((Servicio) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Servicio{" +
            "id=" + getId() +
            ", servicioTitle='" + getServicioTitle() + "'" +
            ", minSalary=" + getMinSalary() +
            ", maxSalary=" + getMaxSalary() +
            "}";
    }
}
