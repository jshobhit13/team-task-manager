package com.taskmanager.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TaskRequest {
    @NotBlank
    private String title;

    private String description;
    private String status;
    private String priority;
    private Long projectId;
    private Long assigneeId;
    private LocalDate dueDate;
}