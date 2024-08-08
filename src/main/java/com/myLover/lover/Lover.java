package com.myLover.lover;

import java.time.LocalDate;
import java.util.List;

public class Lover {
    private String fristname;
    private String lastName;
    private LocalDate fristDay;
    private LocalDate birthday;
    private List<importanteDate> importanteDates;

    public Lover(String fristname, String lastName, LocalDate fristDay, LocalDate birthday,
            List<importanteDate> importanteDates) {
        this.fristname = fristname;
        this.lastName = lastName;
        this.fristDay = fristDay;
        this.birthday = birthday;
        this.importanteDates = importanteDates;
    }
    public String getFristname() {
        return fristname;
    }
    public void setFristname(String fristname) {
        this.fristname = fristname;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public LocalDate getFristDay() {
        return fristDay;
    }
    public void setFristDay(LocalDate fristDay) {
        this.fristDay = fristDay;
    }
    public LocalDate getBirthday() {
        return birthday;
    }
    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }
    public List<importanteDate> getImportanteDates() {
        return importanteDates;
    }
    public void setImportanteDates(List<importanteDate> importanteDates) {
        this.importanteDates = importanteDates;
    }


}
