package com.hogares.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Empleado.
 */
@Document(collection = "empleado")
public class Empleado implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("empleado_id")
    private String empleadoId;

    @Field("first_name")
    private String firstName;

    @Field("last_name")
    private String lastName;

    @Field("email")
    private String email;

    @Field("phone_number")
    private String phoneNumber;

    @Field("hire_date")
    private Instant hireDate;

    @Field("salary")
    private Long salary;

    @Field("commission_pct")
    private Long commissionPct;

    @DBRef
    @Field("trabajo")
    @JsonIgnoreProperties(value = { "tasks", "empleado" }, allowSetters = true)
    private Set<Trabajo> trabajos = new HashSet<>();

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

    public Empleado id(String id) {
        this.id = id;
        return this;
    }

    public String getEmpleadoId() {
        return this.empleadoId;
    }

    public Empleado empleadoId(String empleadoId) {
        this.empleadoId = empleadoId;
        return this;
    }

    public void setEmpleadoId(String empleadoId) {
        this.empleadoId = empleadoId;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public Empleado firstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Empleado lastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public Empleado email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public Empleado phoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Instant getHireDate() {
        return this.hireDate;
    }

    public Empleado hireDate(Instant hireDate) {
        this.hireDate = hireDate;
        return this;
    }

    public void setHireDate(Instant hireDate) {
        this.hireDate = hireDate;
    }

    public Long getSalary() {
        return this.salary;
    }

    public Empleado salary(Long salary) {
        this.salary = salary;
        return this;
    }

    public void setSalary(Long salary) {
        this.salary = salary;
    }

    public Long getCommissionPct() {
        return this.commissionPct;
    }

    public Empleado commissionPct(Long commissionPct) {
        this.commissionPct = commissionPct;
        return this;
    }

    public void setCommissionPct(Long commissionPct) {
        this.commissionPct = commissionPct;
    }

    public Set<Trabajo> getTrabajos() {
        return this.trabajos;
    }

    public Empleado trabajos(Set<Trabajo> trabajos) {
        this.setTrabajos(trabajos);
        return this;
    }

    public Empleado addTrabajo(Trabajo trabajo) {
        this.trabajos.add(trabajo);
        trabajo.setEmpleado(this);
        return this;
    }

    public Empleado removeTrabajo(Trabajo trabajo) {
        this.trabajos.remove(trabajo);
        trabajo.setEmpleado(null);
        return this;
    }

    public void setTrabajos(Set<Trabajo> trabajos) {
        if (this.trabajos != null) {
            this.trabajos.forEach(i -> i.setEmpleado(null));
        }
        if (trabajos != null) {
            trabajos.forEach(i -> i.setEmpleado(this));
        }
        this.trabajos = trabajos;
    }

    public Hogar getHogar() {
        return this.hogar;
    }

    public Empleado hogar(Hogar hogar) {
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
        if (!(o instanceof Empleado)) {
            return false;
        }
        return id != null && id.equals(((Empleado) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Empleado{" +
            "id=" + getId() +
            ", empleadoId='" + getEmpleadoId() + "'" +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", email='" + getEmail() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", hireDate='" + getHireDate() + "'" +
            ", salary=" + getSalary() +
            ", commissionPct=" + getCommissionPct() +
            "}";
    }
}
