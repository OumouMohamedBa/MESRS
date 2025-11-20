package com.example.etablissement.controller;

import com.example.etablissement.model.Permission;
import com.example.etablissement.service.PermissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {

    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    // DTO simple, sans Lombok
    public static class CreatePermissionRequest {
        public String code;
        public String module;
        public String action;
        public String label;
    }

    @GetMapping
    public ResponseEntity<List<Permission>> getAllPermissions() {
        return ResponseEntity.ok(permissionService.getAllPermissions());
    }

    @PostMapping
    public ResponseEntity<Permission> createPermission(@RequestBody CreatePermissionRequest request) {
        Permission permission = permissionService.createPermission(
                request.code,
                request.module,
                request.action,
                request.label
        );
        return ResponseEntity.ok(permission);
    }

    @GetMapping("/{code}")
    public ResponseEntity<Permission> getPermission(@PathVariable String code) {
        return ResponseEntity.ok(permissionService.getPermissionByCode(code));
    }
}
