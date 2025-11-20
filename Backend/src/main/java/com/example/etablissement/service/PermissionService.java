package com.example.etablissement.service;

import com.example.etablissement.model.Permission;
import com.example.etablissement.repository.PermissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class PermissionService {

    private final PermissionRepository permissionRepository;

    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    @Transactional(readOnly = true)
    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Permission getPermissionByCode(String code) {
        return permissionRepository.findByCode(code)
                .orElseThrow(() -> new NoSuchElementException("Permission introuvable : " + code));
    }

    @Transactional
    public Permission createPermission(String code, String module, String action, String label) {
        if (permissionRepository.findByCode(code).isPresent()) {
            throw new IllegalArgumentException("Permission déjà existante : " + code);
        }

        Permission permission = new Permission();
        permission.setCode(code);
        permission.setModule(module);
        permission.setAction(action);
        permission.setLabel(label);

        return permissionRepository.save(permission);
    }
}
