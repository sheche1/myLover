package com.myLover.myLover.Service;

import com.myLover.lover.model.SharedTask;
import com.myLover.lover.model.TaskCollaborationRequest;
import com.myLover.lover.model.User;
import com.myLover.lover.repository.SharedTaskRepository;
import com.myLover.lover.repository.TaskCollaborationRequestRepository;
import com.myLover.lover.service.SharedTaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class SharedTaskServiceTests {

    @Mock private SharedTaskRepository taskRepo;
    @Mock private TaskCollaborationRequestRepository collabRepo;

    @InjectMocks private SharedTaskService service;

    private User user, collaborator;
    private SharedTask createdByUser, assignedToUser, fromOther;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User(); user.setEmail("a@mail.com");
        collaborator = new User(); collaborator.setEmail("b@mail.com");

        createdByUser = new SharedTask();
        createdByUser.setTitle("Creada por user");
        createdByUser.setCreatedBy(user);
        createdByUser.setAssignedTo(collaborator);

        assignedToUser = new SharedTask();
        assignedToUser.setTitle("Asignada a user");
        assignedToUser.setCreatedBy(collaborator);
        assignedToUser.setAssignedTo(user);

        fromOther = new SharedTask();
        fromOther.setTitle("De otro");
        fromOther.setCreatedBy(collaborator);
        fromOther.setAssignedTo(collaborator);
    }

    @Test
    void listFor_includesRelatedTasks() {
        TaskCollaborationRequest req = new TaskCollaborationRequest();
        req.setAccepted(true);
        req.setRequester(user);
        req.setReceiver(collaborator);

        when(collabRepo.findAll()).thenReturn(List.of(req));
        when(taskRepo.findAll()).thenReturn(List.of(createdByUser, assignedToUser, fromOther));

        List<SharedTask> result = service.listFor(user);
        assertThat(result).containsExactlyInAnyOrder(createdByUser, assignedToUser, fromOther);
    }

    @Test
    void create_savesTask() {
        SharedTask t = new SharedTask(); t.setTitle("X");
        when(taskRepo.save(t)).thenReturn(t);
        assertThat(service.create(t)).isEqualTo(t);
    }

    @Test
    void update_existingTask_updatesFields() {
        SharedTask original = new SharedTask();
        original.setId(1L);
        original.setTitle("Old");
        original.setCompleted(false);

        SharedTask updated = new SharedTask();
        updated.setTitle("New");
        updated.setDescription("Updated desc");
        updated.setDueDate(LocalDate.now());
        updated.setCompleted(true);
        updated.setAssignedTo(collaborator);

        when(taskRepo.findById(1L)).thenReturn(Optional.of(original));
        when(taskRepo.save(any())).thenReturn(original);

        SharedTask result = service.update(1L, updated);
        assertThat(result.getTitle()).isEqualTo("New");
        assertThat(result.isCompleted()).isTrue();
    }

    @Test
    void delete_removesById() {
        service.delete(1L);
        verify(taskRepo).deleteById(1L);
    }

    @Test
    void getById_found_returnsTask() {
        SharedTask t = new SharedTask(); t.setId(1L);
        when(taskRepo.findById(1L)).thenReturn(Optional.of(t));
        assertThat(service.getById(1L)).isEqualTo(t);
    }
}
