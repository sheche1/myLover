package com.myLover.lover.model;

import java.time.LocalDate;

public class importanteDate {
    private LocalDate day;
    private String description;

    
    public importanteDate(LocalDate day, String description) {
        this.day = day;
        this.description = description;
    }
    public LocalDate getDay() {
        return day;
    }
    public void setDay(LocalDate day) {
        this.day = day;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

}
