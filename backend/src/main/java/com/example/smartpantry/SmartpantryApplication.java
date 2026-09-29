package com.example.smartpantry;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SmartpantryApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartpantryApplication.class, args);
	}

}
