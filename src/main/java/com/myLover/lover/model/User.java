package com.myLover.lover.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "name", nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Column(nullable = false)
    private String nombrePareja;

    @Column(nullable = false)
    private String apellidoPareja;

    @Column(name = "birth_date", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(name = "partner_birth_date", nullable = false)
    private LocalDate fechaNacimientoPareja;

    @Column(name = "first_meet_date", nullable = false)
    private LocalDate fechaPrimerEncuentro;

    @ManyToMany
    @JsonIgnoreProperties({"friends", "friendRequests"}) 
    private List<User> friendRequests = new ArrayList<>();


    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"friends", "friendRequests"}) 
    private List<User> friends;
    

    private String status = "No establecido"; 
    

    public Long getId() {
        return id;
    }
    public List<User> getFriendRequests() {
        return friendRequests;
    }
    public void setFriendRequests(List<User> friendRequests) {
        this.friendRequests = friendRequests;
    }
    public List<User> getFriends() {
        return friends;
    }
    public void setFriends(List<User> friends) {
        this.friends = friends;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }
    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getNombrePareja() {
        return nombrePareja;
    }
    public void setNombrePareja(String nombrePareja) {
        this.nombrePareja = nombrePareja;
    }

    public String getApellidoPareja() {
        return apellidoPareja;
    }
    public void setApellidoPareja(String apellidoPareja) {
        this.apellidoPareja = apellidoPareja;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }
    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public LocalDate getFechaNacimientoPareja() {
        return fechaNacimientoPareja;
    }
    public void setFechaNacimientoPareja(LocalDate fechaNacimientoPareja) {
        this.fechaNacimientoPareja = fechaNacimientoPareja;
    }

    public LocalDate getFechaPrimerEncuentro() {
        return fechaPrimerEncuentro;
    }
    public void setFechaPrimerEncuentro(LocalDate fechaPrimerEncuentro) {
        this.fechaPrimerEncuentro = fechaPrimerEncuentro;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

}
