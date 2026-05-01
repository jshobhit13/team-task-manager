package com.taskmanager.backend.service;

import com.taskmanager.backend.dto.TaskRequest;
import com.taskmanager.backend.model.Task;
import com.taskmanager.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;
    private final UserService userService;

    public List<Task> getByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public List<Task> getAll() {
        return taskRepository.findAll();
    }

    public Task create(TaskRequest req) {
        Task task = Task.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .project(projectService.getById(req.getProjectId()))
                .assignee(req.getAssigneeId() != null ? userService.getAllUsers().stream()
                        .filter(u -> u.getId().equals(req.getAssigneeId()))
                        .findFirst().orElse(null) : null)
                .dueDate(req.getDueDate())
                .status(req.getStatus() != null ? Task.Status.valueOf(req.getStatus()) : Task.Status.TODO)
                .priority(req.getPriority() != null ? Task.Priority.valueOf(req.getPriority()) : Task.Priority.MEDIUM)
                .build();
        return taskRepository.save(task);
    }

    public Task update(Long id, TaskRequest req) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        if (req.getStatus() != null)
            task.setStatus(Task.Status.valueOf(req.getStatus()));
        if (req.getPriority() != null)
            task.setPriority(Task.Priority.valueOf(req.getPriority()));
        if (req.getAssigneeId() != null) {
            userService.getAllUsers().stream()
                    .filter(u -> u.getId().equals(req.getAssigneeId()))
                    .findFirst().ifPresent(task::setAssignee);
        }
        task.setDueDate(req.getDueDate());
        return taskRepository.save(task);
    }

    public void delete(Long id) {
        taskRepository.deleteById(id);
    }

    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", taskRepository.count());
        stats.put("todo", taskRepository.countByStatus(Task.Status.TODO));
        stats.put("inProgress", taskRepository.countByStatus(Task.Status.IN_PROGRESS));
        stats.put("done", taskRepository.countByStatus(Task.Status.DONE));
        stats.put("projects", projectService.count());
        return stats;
    }
}