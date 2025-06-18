package com.example.sensor_api.services;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.sensor_api.repository.sensor_repository;
import com.example.sensor_api.models.sensor_model;

@Service
public class sensor_service {
    @Autowired
    private sensor_repository repository;
    public sensor_model create(sensor_model sensor) {
        return repository.save(sensor);
    }
    public void delete(long id) { 
        repository.deleteById(id);
    }
    public sensor_model getByID(long id) {
        sensor_model sensor = repository.findById(id).orElse(null);
        return sensor;
    }
    public List<sensor_model> getAll() {
        return repository.findAll();
    }
    public sensor_model update(sensor_model sensor) {
            Optional<sensor_model> new_sensor = repository.findById(sensor.getId());
            new_sensor.get().setName(sensor.getName());
            new_sensor.get().setCurrentValue(sensor.getCurrentValue());
            new_sensor.get().setUnit(sensor.getUnit());
            new_sensor.get().setStatus(sensor.getStatus());
            new_sensor.get().setType(sensor.getType());
            new_sensor.get().setLocation(sensor.getLocation());
            return repository.save(new_sensor.get());
    }
}
