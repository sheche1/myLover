package com.myLover.lover.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class MemoryLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;      
    private String description; 
    private Double latitude;
    private Double longitude;
    private LocalDate dateVisited; 

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)

    private User user; 
    private String photoUrl;            

    public String getPhotoUrl() {
         return photoUrl; 
    }
    public void setPhotoUrl(String photoUrl) { 
        this.photoUrl = photoUrl; 
    }
   
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public LocalDate getDateVisited() {
        return dateVisited;
    }

    public void setDateVisited(LocalDate dateVisited) {
        this.dateVisited = dateVisited;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
