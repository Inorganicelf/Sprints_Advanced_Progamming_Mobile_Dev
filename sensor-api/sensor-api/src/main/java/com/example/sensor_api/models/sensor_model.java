package com.example.sensor_api.models;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GenerationType;

@Entity
@Table(name = "sensor_model")
public class sensor_model {
    @Id 
    @GeneratedValue(strategy = GenerationType .IDENTITY)
    private Long id;
    private String name;
    private float currentValue;
    private String unit;
    private String status;
    private String type;
    private String location;

    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public float getCurrentValue() {
        return currentValue;
    }
    public void setCurrentValue(float currentValue) {
        this.currentValue = currentValue;
    }
    public String getUnit() {
        return unit;
    }
    public void setUnit(String unit) {
        this.unit = unit;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getType()
    {
        return type;
    }
    public void setType(String type)
    {
        this.type = type;
    }
    public String getLocation()
    {
        return location;
    }
    public void setLocation(String location)
    {
        this.location = location;
    }
}
