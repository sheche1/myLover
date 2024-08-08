package com.myLover.lover;

import java.time.LocalDate;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("Mylover")
public class loverController {
    
    @GetMapping
    public Lover getMyLover(){
        return new Lover("栀钰", "贾", 
        LocalDate.of(2023, 8, 29), 
        LocalDate.of(2005, 10, 29), 
        null);
    }
}
