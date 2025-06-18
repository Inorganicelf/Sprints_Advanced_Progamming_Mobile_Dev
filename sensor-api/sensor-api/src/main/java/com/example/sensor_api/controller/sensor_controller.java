package com.example.sensor_api.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.sensor_api.models.sensor_model;
import com.example.sensor_api.services.sensor_service;

@RestController
@RequestMapping("/api/readings")
@CrossOrigin(origins = "*")

public class sensor_controller {
    @Autowired
    private sensor_service s;
    @PostMapping("/create")
    public ResponseEntity<sensor_model> create(@RequestBody sensor_model sensor) {
        return ResponseEntity.status(HttpStatus.CREATED).body(s.create(sensor));
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        s.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<sensor_model> update(@PathVariable Long id, @RequestBody sensor_model sensor) {
        sensor.setId(id);
        return ResponseEntity.status(HttpStatus.OK).body(s.update(sensor));
    }
    @GetMapping("/get/{id}")
    public ResponseEntity<sensor_model> getByID(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(s.getByID(id));
    }
    @GetMapping("/get")
    public ResponseEntity<List<sensor_model>> getAll() {
        return ResponseEntity.status(HttpStatus.OK).body(s.getAll());
    }
}
