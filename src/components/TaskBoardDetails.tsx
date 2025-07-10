import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Badge,
  Row,
  Col,
  Image,
  ProgressBar,
  ListGroup,
} from "react-bootstrap";
import { getStatusColor } from "../utils/userUtils";

interface TaskBoardDetailsProps {
  task: Task;
  show: boolean;
  onClose: () => void;
  currentUser: { id: string; name: string; avatar: string; email: string };
  onUpdateTask: (updatedTask: Task) => void;
}

const TaskBoardDetails: React.FC<TaskBoardDetailsProps> = ({
  task,
  show,
  onClose,
  currentUser,
  onUpdateTask,
}) => {
  const [comment, setComment] = useState("");
  const [editingChecklistId, setEditingChecklistId] = useState<string | null>(
    null
  );
  const [newChecklistText, setNewChecklistText] = useState("");
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;

    const newComment = {
      id: `c${Date.now()}`,
      user: currentUser,
      text: comment,
      timestamp: new Date().toISOString(),
    };

    const updatedTask = {
      ...task,
      comments: [...task.comments, newComment],
    };

    onUpdateTask(updatedTask);
    setComment("");
  };

  const toggleChecklistItem = (itemId: string) => {
    const updatedChecklist = task.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const completedCount = updatedChecklist.filter(
      (item) => item.completed
    ).length;

    const updatedTask = {
      ...task,
      checklist: updatedChecklist,
      completedTasks: completedCount,
      totalTasks: updatedChecklist.length,
    };

    onUpdateTask(updatedTask);
  };

  const updateChecklistText = (itemId: string, newText: string) => {
    const updatedChecklist = task.checklist.map((item) =>
      item.id === itemId ? { ...item, text: newText } : item
    );

    onUpdateTask({
      ...task,
      checklist: updatedChecklist,
    });
  };

  const addChecklistItem = () => {
    if (!newChecklistText.trim()) return;

    const newItem: ChecklistItem = {
      id: `cl${Date.now()}`,
      text: newChecklistText,
      completed: false,
    };

    const updatedTask = {
      ...task,
      checklist: [...task.checklist, newItem],
      totalTasks: task.checklist.length + 1,
    };

    onUpdateTask(updatedTask);
    setNewChecklistText("");
    setIsAddingChecklist(false);
  };

  const deleteChecklistItem = (itemId: string) => {
    const updatedChecklist = task.checklist.filter(
      (item) => item.id !== itemId
    );
    const completedCount = updatedChecklist.filter(
      (item) => item.completed
    ).length;

    const updatedTask = {
      ...task,
      checklist: updatedChecklist,
      completedTasks: completedCount,
      totalTasks: updatedChecklist.length,
    };

    onUpdateTask(updatedTask);
  };

  const getPriorityVariant = (priority: Priority) => {
    switch (priority) {
      case "High":
        return "danger";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "secondary";
    }
  };

  const completionPercentage = task.totalTasks
    ? Math.round(((task.completedTasks || 0) / task.totalTasks) * 100)
    : 0;

  return (
    <Modal show={show} onHide={onClose} size="lg" centered scrollable>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-4">{task.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-1">
        <div className="d-flex flex-wrap gap-2 mb-3">
          <Badge bg="secondary">{task.category}</Badge>
          <Badge bg={getPriorityVariant(task.priority)}>{task.priority}</Badge>
          <Badge style={{ backgroundColor: getStatusColor(task.status) }}>
            {task.status}
          </Badge>
        </div>

        <p className="mb-4">{task.description || "No description provided"}</p>

        <Row className="mb-4 g-3">
          <Col md={6}>
            <div className="bg-light p-3 rounded">
              <h6 className="fw-bold mb-3">Task Details</h6>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Created by:</span>
                <div className="d-flex align-items-center gap-2">
                  <Image
                    src={task.createdBy.avatar}
                    roundedCircle
                    width={24}
                    height={24}
                  />
                  <span>{task.createdBy.name}</span>
                </div>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Assigned to:</span>
                <div className="d-flex align-items-center gap-2">
                  <Image
                    src={task.assignedTo.avatar}
                    roundedCircle
                    width={24}
                    height={24}
                  />
                  <span>{task.assignedTo.name}</span>
                </div>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Start Date:</span>
                <span>{task.startDate || "Not specified"}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Due Date:</span>
                <span>{task.dueDate || "Not specified"}</span>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="bg-light p-3 rounded h-100">
              <h6 className="fw-bold mb-3">Progress</h6>
              <div className="mb-2">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Completion:</span>
                  <span>
                    {task.completedTasks || 0}/{task.totalTasks || 0} tasks (
                    {completionPercentage}%)
                  </span>
                </div>
                <ProgressBar
                  now={completionPercentage}
                  variant="success"
                  style={{ height: "6px" }}
                />
              </div>
              {task.attachments.length > 0 && (
                <div>
                  <h6 className="fw-bold mt-4 mb-2">Attachments</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {task.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.url}
                        className="d-flex align-items-center gap-1 text-decoration-none"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-paperclip"></i>
                        <span className="small">{attachment.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* Checklist Section */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0">Checklist</h6>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setIsAddingChecklist(true)}
            >
              <i className="bi bi-plus"></i> Add Item
            </Button>
          </div>

          {isAddingChecklist && (
            <div className="d-flex gap-2 mb-3">
              <Form.Control
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                placeholder="Enter checklist item"
                autoFocus
              />
              <Button variant="primary" size="sm" onClick={addChecklistItem}>
                Add
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  setIsAddingChecklist(false);
                  setNewChecklistText("");
                }}
              >
                Cancel
              </Button>
            </div>
          )}

          <ListGroup>
            {task.checklist.length > 0 ? (
              task.checklist.map((item) => (
                <ListGroup.Item
                  key={item.id}
                  className="d-flex align-items-center"
                >
                  <Form.Check
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleChecklistItem(item.id)}
                    className="me-3"
                  />

                  {editingChecklistId === item.id ? (
                    <div className="d-flex flex-grow-1 gap-2">
                      <Form.Control
                        type="text"
                        value={item.text}
                        onChange={(e) =>
                          updateChecklistText(item.id, e.target.value)
                        }
                        onBlur={() => setEditingChecklistId(null)}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div
                      className={`flex-grow-1 ${
                        item.completed
                          ? "text-decoration-line-through text-muted"
                          : ""
                      }`}
                      onDoubleClick={() => setEditingChecklistId(item.id)}
                    >
                      {item.text}
                    </div>
                  )}

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteChecklistItem(item.id)}
                    className="ms-2"
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </ListGroup.Item>
              ))
            ) : (
              <div className="text-center py-3 text-muted">
                No checklist items yet
              </div>
            )}
          </ListGroup>
        </div>

        {/* Comments Section */}
        <div className="mb-4">
          <h6 className="fw-bold mb-3">Comments</h6>
          <div
            className="bg-light p-3 rounded"
            style={{ maxHeight: "200px", overflowY: "auto" }}
          >
            {task.comments.length > 0 ? (
              task.comments.map((comment) => (
                <div key={comment.id} className="mb-3 pb-2 border-bottom">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <Image
                        src={comment.user.avatar}
                        roundedCircle
                        width={32}
                        height={32}
                      />
                      <strong>{comment.user.name}</strong>
                    </div>
                    <small className="text-muted">
                      {new Date(comment.timestamp).toLocaleString()}
                    </small>
                  </div>
                  <p className="mb-0 ps-4">{comment.text}</p>
                  {comment.attachment && (
                    <div className="ps-4 mt-2">
                      <a href="#" className="small">
                        <i className="bi bi-paperclip me-1"></i>
                        {comment.attachment}
                      </a>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted text-center py-3">No comments yet</p>
            )}
          </div>
        </div>

        {/* Add Comment */}
        <div>
          <h6 className="fw-bold mb-3">Add Comment</h6>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              placeholder="Write your comment here..."
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Group>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="outline-secondary" onClick={() => setComment("")}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCommentSubmit}
              disabled={!comment.trim()}
            >
              Post Comment
            </Button>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskBoardDetails;
