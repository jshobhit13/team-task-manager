package com.taskmanager.backend.controller;

import com.taskmanager.backend.dto.ProjectRequest;
import com.taskmanager.backend.model.Project;
import com.taskmanager.backend.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<Project>> getAll() {
        return ResponseEntity.ok(projectService.getAll());
    }

    @PostMapping
    public ResponseEntity<Project> create(@Valid @RequestBody ProjectRequest req,
            Authentication auth) {
        return ResponseEntity.ok(projectService.create(req, auth.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> update(@PathVariable Long id,
            @Valid @RequestBody ProjectRequest req) {
        return ResponseEntity.ok(projectService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}