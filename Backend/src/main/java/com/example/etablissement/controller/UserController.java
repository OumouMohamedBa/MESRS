package com.example.etablissement.controller;

import com.example.etablissement.model.User;
import com.example.etablissement.service.UserService;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // DTOs simples sans Lombok
    public static class CreateUserRequest {
        public String username;
        public String name;
        public String phone;
        public String password;
        public String photo;
        public String roleCode;  // ex: INSPECTEUR_SIMPLE
    }

    public static class UpdateUserRequest {
        public String name;
        public String phone;
        public String photo;
    }

    public static class ChangeRoleRequest {
        public String roleCode;
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest request) {
        User user = new User();
        user.setUsername(request.username);
        user.setName(request.name);
        user.setPhone(request.phone);
        user.setPassword(request.password);
        user.setPhoto(request.photo);

        User created = userService.createUser(user, request.roleCode);
        return ResponseEntity.ok(created);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id,
                                           @RequestBody UpdateUserRequest request) {
        User updated = userService.updateUser(
                id,
                request.name,
                request.phone,
                request.photo
        );
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<Void> activateUser(@PathVariable Long id) {
        userService.activateUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long id) {
        userService.deactivateUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/validate")
    public ResponseEntity<Void> validateUser(@PathVariable Long id) {
        userService.validateUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/invalidate")
    public ResponseEntity<Void> invalidateUser(@PathVariable Long id) {
        userService.invalidateUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<Void> changeUserRole(@PathVariable Long id,
                                               @RequestBody ChangeRoleRequest request) {
        userService.changeUserRole(id, request.roleCode);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping
    public ResponseEntity<Page<User>> searchUsers(
            @RequestParam(required = false) String roleCode,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) Boolean validated,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name,asc") String sort
    ) {
        String[] sortParts = sort.split(",");
        Sort.Direction direction = sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortParts[0]));

        Page<User> result = userService.searchInspectors(
                roleCode,
                active,
                validated,
                keyword,
                pageable
        );

        return ResponseEntity.ok(result);
    }
}
