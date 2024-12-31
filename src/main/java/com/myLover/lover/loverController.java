package com.myLover.lover;

import java.time.LocalDate;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("mylover")
public class loverController {
    
    @GetMapping
    public Lover getMyLover(){
        return new Lover("栀钰", "贾", 
        LocalDate.of(2024, 8, 29), 
        LocalDate.of(2005, 10, 29), 
        null);
    }
}
