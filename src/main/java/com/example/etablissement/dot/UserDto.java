package com.example.etablissement.dto;

import com.example.etablissement.model.Role;
import com.example.etablissement.model.User;

public class UserDto {

  private Long id;
  private String fullname;
  private String username;
  private String phone;
  private String role;   // ex: "INSPECTEUR_GENERAL"
  private String password; // Nouveau champ pour la création/modif
  private boolean active;

  public UserDto() {}

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getFullname() {
    return fullname;
  }

  public void setFullname(String fullname) {
    this.fullname = fullname;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
  }

  // Entity -> DTO
  public static UserDto fromEntity(User user) {
    UserDto dto = new UserDto();
    dto.setId(user.getId());
    dto.setFullname(user.getName());
    dto.setUsername(user.getUsername());
    dto.setPhone(user.getPhone());
    dto.setActive(user.isActive());

    Role role = user.getRole();
    if (role != null) {
      dto.setRole(role.getCode()); // "INSPECTEUR_GENERAL", "SOUS_INSPECTEUR", etc.
    }

    return dto;
  }

  // DTO -> met à jour une entity User existante
  public void updateEntity(User user, Role roleEntity) {
    user.setName(this.fullname);
    user.setUsername(this.username);
    user.setPhone(this.phone);
    user.setRole(roleEntity);
    user.setActive(this.active);
    // on NE TOUCHE PAS au password ni validated ici
  }
}
