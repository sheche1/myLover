package com.myLover.lover.repository;

import com.myLover.lover.model.TaskCollaborationRequest;
import com.myLover.lover.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskCollaborationRequestRepository extends JpaRepository<TaskCollaborationRequest, Long> {

    boolean existsByRequesterAndReceiver(User requester, User receiver);

    List<TaskCollaborationRequest> findByReceiverAndAcceptedFalse(User receiver);

    boolean existsByRequesterAndReceiverAndAcceptedTrue(User requester, User receiver);
}

