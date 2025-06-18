package com.example.sensor_api.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.sensor_api.models.sensor_model;

public interface sensor_repository extends JpaRepository<sensor_model, Long> {

}