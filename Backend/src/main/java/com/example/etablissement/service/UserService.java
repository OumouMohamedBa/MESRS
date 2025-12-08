package com.example.etablissement.service;

import com.example.etablissement.dto.UserDto;
import com.example.etablissement.model.Role;
import com.example.etablissement.model.User;
import com.example.etablissement.repository.RoleRepository;
import com.example.etablissement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;

  public UserService(UserRepository userRepository,
                     RoleRepository roleRepository) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
  }

  public List<UserDto> findAll() {
    return userRepository.findAll()
      .stream()
      .map(UserDto::fromEntity)
      .collect(Collectors.toList());
  }

  public UserDto create(UserDto dto) {
    if (userRepository.existsByUsername(dto.getUsername())) {
      throw new RuntimeException("Username déjà utilisé.");
    }

    Role role = roleRepository.findByCode(dto.getRole())
      .orElseThrow(() -> new RuntimeException("Rôle introuvable: " + dto.getRole()));

    User user = new User();
    dto.updateEntity(user, role);

    // password par défaut (à adapter, ou générer aléatoire)
    user.setPassword("changeme");
    user.setValidated(true); // ou false si tu veux validation plus tard

    User saved = userRepository.save(user);
    return UserDto.fromEntity(saved);
  }

  public UserDto update(Long id, UserDto dto) {
    User user = userRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

    Role role = roleRepository.findByCode(dto.getRole())
      .orElseThrow(() -> new RuntimeException("Rôle introuvable: " + dto.getRole()));

    dto.updateEntity(user, role);

    User saved = userRepository.save(user);
    return UserDto.fromEntity(saved);
  }

  public void delete(Long id) {
    if (!userRepository.existsById(id)) {
      throw new RuntimeException("Utilisateur introuvable");
    }
    userRepository.deleteById(id);
  }

  public UserDto toggleActive(Long id) {
    User user = userRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

    user.setActive(!user.isActive());

    User saved = userRepository.save(user);
    return UserDto.fromEntity(saved);
  }
}
