package com.taskmanager.backend.service;

import com.taskmanager.backend.dto.ProjectRequest;
import com.taskmanager.backend.model.Project;
import com.taskmanager.backend.model.User;
import com.taskmanager.backend.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserService userService;

    public List<Project> getAll() {
        return projectRepository.findAllByOrderByCreatedAtDesc();
    }

    public Project create(ProjectRequest req, String email) {
        User owner = userService.findByEmail(email);
        Project project = Project.builder()
                .name(req.getName())
                .description(req.getDescription())
                .owner(owner)
                .build();
        return projectRepository.save(project);
    }

    public Project update(Long id, ProjectRequest req) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setName(req.getName());
        project.setDescription(req.getDescription());
        return projectRepository.save(project);
    }

    public void delete(Long id) {
        projectRepository.deleteById(id);
    }

    public Project getById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public long count() {
        return projectRepository.count();
    }
}
