package com.example.etablissement.controller;

import com.example.etablissement.model.Role;
import com.example.etablissement.service.RoleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    // DTO simple sans Lombok
    public static class UpdateRolePermissionsRequest {
        public Set<String> permissionCodes;
    }

    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

    @GetMapping("/{code}")
    public ResponseEntity<Role> getRoleByCode(@PathVariable String code) {
        return ResponseEntity.ok(roleService.getRoleByCode(code));
    }

    @PutMapping("/{code}/permissions")
    public ResponseEntity<Role> updateRolePermissions(
            @PathVariable String code,
            @RequestBody UpdateRolePermissionsRequest request
    ) {
        Role updated = roleService.updateRolePermissions(code, request.permissionCodes);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{code}/permissions/{permissionCode}")
    public ResponseEntity<Role> addPermissionToRole(
            @PathVariable String code,
            @PathVariable String permissionCode
    ) {
        Role updated = roleService.addPermissionToRole(code, permissionCode);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{code}/permissions/{permissionCode}")
    public ResponseEntity<Role> removePermissionFromRole(
            @PathVariable String code,
            @PathVariable String permissionCode
    ) {
        Role updated = roleService.removePermissionFromRole(code, permissionCode);
        return ResponseEntity.ok(updated);
    }
}
