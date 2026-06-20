package com.ferreiraluizga.smartinventory.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

@RestController
@RequestMapping("/")
public class HomeController {
    @GetMapping("/")
    public Map<String, String> home() {
        return Map.of(
                "application", "SmartInventory API",
                "version", "1.0.0",
                "docs", "/swagger-ui/index.html"
        );
    }
}
