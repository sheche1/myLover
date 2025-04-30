package com.myLover.lover.service;

import com.myLover.lover.model.SharedTask;
import com.myLover.lover.model.User;
import com.myLover.lover.repository.SharedTaskRepository;
import com.myLover.lover.repository.TaskCollaborationRequestRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SharedTaskService {

    private final SharedTaskRepository repo;
    private final TaskCollaborationRequestRepository collabRepo;

    public SharedTaskService(SharedTaskRepository repo, TaskCollaborationRequestRepository collabRepo) {
        this.repo = repo;
        this.collabRepo = collabRepo;
    }

    public List<SharedTask> listFor(User user) {
        List<User> collaborators = collabRepo.findAll().stream()
                .filter(r -> r.isAccepted() &&
                        (r.getRequester().equals(user) || r.getReceiver().equals(user)))
                .map(r -> r.getRequester().equals(user) ? r.getReceiver() : r.getRequester())
                .distinct()
                .toList();

        List<User> allVisible = new ArrayList<>(collaborators);
        allVisible.add(user);

        return repo.findAll().stream()
                .filter(t -> allVisible.contains(t.getCreatedBy()) || allVisible.contains(t.getAssignedTo()))
                .toList();
    }

    public SharedTask create(SharedTask t) {
        return repo.save(t);
    }

    public SharedTask update(Long id, SharedTask t) {
        return repo.findById(id).map(old -> {
            old.setTitle(t.getTitle());
            old.setDescription(t.getDescription());
            old.setDueDate(t.getDueDate());
            old.setCompleted(t.isCompleted());
            old.setAssignedTo(t.getAssignedTo());
            return repo.save(old);
        }).orElseThrow();
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public SharedTask getById(Long id) {
        return repo.findById(id).orElseThrow();
    }
}
