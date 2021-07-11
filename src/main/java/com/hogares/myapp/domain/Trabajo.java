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
 * A Trabajo.
 */
@Document(collection = "trabajo")
public class Trabajo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("trabajo_title")
    private String trabajoTitle;

    @Field("min_salary")
    private Long minSalary;

    @Field("max_salary")
    private Long maxSalary;

    @DBRef
    @Field("task")
    @JsonIgnoreProperties(value = { "trabajo" }, allowSetters = true)
    private Set<Task> tasks = new HashSet<>();

    @DBRef
    @Field("empleado")
    @JsonIgnoreProperties(value = { "trabajos", "hogar" }, allowSetters = true)
    private Empleado empleado;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Trabajo id(String id) {
        this.id = id;
        return this;
    }

    public String getTrabajoTitle() {
        return this.trabajoTitle;
    }

    public Trabajo trabajoTitle(String trabajoTitle) {
        this.trabajoTitle = trabajoTitle;
        return this;
    }

    public void setTrabajoTitle(String trabajoTitle) {
        this.trabajoTitle = trabajoTitle;
    }

    public Long getMinSalary() {
        return this.minSalary;
    }

    public Trabajo minSalary(Long minSalary) {
        this.minSalary = minSalary;
        return this;
    }

    public void setMinSalary(Long minSalary) {
        this.minSalary = minSalary;
    }

    public Long getMaxSalary() {
        return this.maxSalary;
    }

    public Trabajo maxSalary(Long maxSalary) {
        this.maxSalary = maxSalary;
        return this;
    }

    public void setMaxSalary(Long maxSalary) {
        this.maxSalary = maxSalary;
    }

    public Set<Task> getTasks() {
        return this.tasks;
    }

    public Trabajo tasks(Set<Task> tasks) {
        this.setTasks(tasks);
        return this;
    }

    public Trabajo addTask(Task task) {
        this.tasks.add(task);
        task.setTrabajo(this);
        return this;
    }

    public Trabajo removeTask(Task task) {
        this.tasks.remove(task);
        task.setTrabajo(null);
        return this;
    }

    public void setTasks(Set<Task> tasks) {
        if (this.tasks != null) {
            this.tasks.forEach(i -> i.setTrabajo(null));
        }
        if (tasks != null) {
            tasks.forEach(i -> i.setTrabajo(this));
        }
        this.tasks = tasks;
    }

    public Empleado getEmpleado() {
        return this.empleado;
    }

    public Trabajo empleado(Empleado empleado) {
        this.setEmpleado(empleado);
        return this;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Trabajo)) {
            return false;
        }
        return id != null && id.equals(((Trabajo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Trabajo{" +
            "id=" + getId() +
            ", trabajoTitle='" + getTrabajoTitle() + "'" +
            ", minSalary=" + getMinSalary() +
            ", maxSalary=" + getMaxSalary() +
            "}";
    }
}
