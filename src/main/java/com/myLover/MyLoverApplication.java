package com.myLover;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.myLover.lover.repository")
@EntityScan(basePackages = "com.myLover.lover.model")
public class MyLoverApplication {

	public static void main(String[] args) {
		SpringApplication.run(MyLoverApplication.class, args);
	}

}
