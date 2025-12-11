package com.example.etablissement.service;

import com.example.etablissement.model.Permission;
import com.example.etablissement.model.Role;
import com.example.etablissement.repository.PermissionRepository;
import com.example.etablissement.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public RoleService(RoleRepository roleRepository,
                       PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    @Transactional(readOnly = true)
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Role getRoleByCode(String code) {
        return roleRepository.findByCode(code)
                .orElseThrow(() -> new NoSuchElementException("Rôle introuvable : " + code));
    }

    @Transactional
    public Role createRole(String code, String label, String description) {

        if (roleRepository.findByCode(code).isPresent()) {
            throw new IllegalArgumentException("Rôle déjà existant : " + code);
        }

        Role role = new Role();
        role.setCode(code);
        role.setLabel(label);
        role.setPermissions(new HashSet<>());

        return roleRepository.save(role);
    }

    @Transactional
    public Role updateRolePermissions(String roleCode, Set<String> permissionCodes) {

        Role role = getRoleByCode(roleCode);

        List<Permission> permissions = permissionRepository.findAll()
                .stream()
                .filter(p -> permissionCodes.contains(p.getCode()))
                .collect(Collectors.toList());

        role.setPermissions(new HashSet<>(permissions));

        return roleRepository.save(role);
    }

    @Transactional
    public Role addPermissionToRole(String roleCode, String permissionCode) {

        Role role = getRoleByCode(roleCode);

        Permission permission = permissionRepository.findByCode(permissionCode)
                .orElseThrow(() -> new NoSuchElementException("Permission introuvable : " + permissionCode));

        role.getPermissions().add(permission);

        return roleRepository.save(role);
    }

    @Transactional
    public Role removePermissionFromRole(String roleCode, String permissionCode) {

        Role role = getRoleByCode(roleCode);

        Permission permission = permissionRepository.findByCode(permissionCode)
                .orElseThrow(() -> new NoSuchElementException("Permission introuvable : " + permissionCode));

        role.getPermissions().remove(permission);

        return roleRepository.save(role);
    }
}
