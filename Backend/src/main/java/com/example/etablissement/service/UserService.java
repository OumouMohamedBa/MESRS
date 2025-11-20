package com.example.etablissement.service;

import com.example.etablissement.model.Role;
import com.example.etablissement.model.User;
import com.example.etablissement.repository.RoleRepository;
import com.example.etablissement.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    // ✅ Constructeur explicite pour l’injection
    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Transactional
    public User createUser(User user, String roleCode) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username déjà utilisé : " + user.getUsername());
        }

        Role role = roleRepository.findByCode(roleCode)
                .orElseThrow(() -> new NoSuchElementException("Rôle introuvable : " + roleCode));

        user.setRole(role);
        user.setActive(true);
        user.setValidated(false);

        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long userId, String name, String phone, String photo) {
        User user = getUserById(userId);
        if (name != null) user.setName(name);
        if (phone != null) user.setPhone(phone);
        if (photo != null) user.setPhoto(photo);
        return userRepository.save(user);
    }

    @Transactional
    public void activateUser(Long userId) {
        User user = getUserById(userId);
        user.setActive(true);
        userRepository.save(user);
    }

    @Transactional
    public void deactivateUser(Long userId) {
        User user = getUserById(userId);
        user.setActive(false);
        userRepository.save(user);
    }

    @Transactional
    public void validateUser(Long userId) {
        User user = getUserById(userId);
        user.setValidated(true);
        userRepository.save(user);
    }

    @Transactional
    public void invalidateUser(Long userId) {
        User user = getUserById(userId);
        user.setValidated(false);
        userRepository.save(user);
    }

    @Transactional
    public void changeUserRole(Long userId, String newRoleCode) {
        User user = getUserById(userId);
        Role role = roleRepository.findByCode(newRoleCode)
                .orElseThrow(() -> new NoSuchElementException("Rôle introuvable : " + newRoleCode));
        user.setRole(role);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Page<User> searchInspectors(String roleCode,
                                       Boolean active,
                                       Boolean validated,
                                       String keyword,
                                       Pageable pageable) {
        return userRepository.searchInspectors(roleCode, active, validated, keyword, pageable);
    }

    @Transactional(readOnly = true)
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Utilisateur introuvable id=" + userId));
    }

    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("Utilisateur introuvable username=" + username));
    }
}
