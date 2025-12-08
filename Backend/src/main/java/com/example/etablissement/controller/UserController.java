package com.example.etablissement.controller;

import com.example.etablissement.dto.UserDto;
import com.example.etablissement.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:4200") // pour Angular
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  // GET /users
  @GetMapping
  public ResponseEntity<List<UserDto>> getAll() {
    return ResponseEntity.ok(userService.findAll());
  }

  // POST /users
  @PostMapping
  public ResponseEntity<UserDto> create(@RequestBody UserDto dto) {
    UserDto created = userService.create(dto);
    return ResponseEntity.ok(created);
  }

  // PUT /users/{id}
  @PutMapping("/{id}")
  public ResponseEntity<UserDto> update(@PathVariable Long id,
                                        @RequestBody UserDto dto) {
    UserDto updated = userService.update(id, dto);
    return ResponseEntity.ok(updated);
  }

  // DELETE /users/{id}
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    userService.delete(id);
    return ResponseEntity.noContent().build();
  }

  // PATCH /users/{id}/status  → toggle active
  @PatchMapping("/{id}/status")
  public ResponseEntity<UserDto> toggleStatus(@PathVariable Long id) {
    UserDto updated = userService.toggleActive(id);
    return ResponseEntity.ok(updated);
  }
}
