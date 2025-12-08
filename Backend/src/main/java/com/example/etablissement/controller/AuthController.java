package com.example.etablissement.controller;
import com.example.etablissement.dot.LoginResponseDto;
import com.example.etablissement.model.User;
import com.example.etablissement.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

  private final UserRepository userRepository;

  public AuthController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @PostMapping("/login")
  public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequest request) {
    User user = userRepository.findByUsername(request.getUsername())
      .orElseThrow(() -> new ResponseStatusException(
        HttpStatus.UNAUTHORIZED, "Utilisateur inexistant"));

    if (!user.getPassword().equals(request.getPassword())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Mot de passe invalide");
    }

    if (!user.isActive() || !user.isValidated()) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Compte inactif ou non validé");
    }

    String roleCode = user.getRole() != null ? user.getRole().getCode() : null;

    LoginResponseDto dto = new LoginResponseDto(user.getUsername(), roleCode);
    return ResponseEntity.ok(dto);
  }

  public static class LoginRequest {
    private String username;
    private String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
  }
}
