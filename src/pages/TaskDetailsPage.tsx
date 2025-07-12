import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TaskService } from "../services/taskServices";
import type { Task } from "../interfaces/task";
import { Button, ListGroup, Spinner, Form, ProgressBar, Alert } from "react-bootstrap";
import { getStatusColor } from "../utils/userUtils";
import api from "../api/api";
import { useAuth } from "../context/AuthContext"; 

const TaskDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [newChecklistText, setNewChecklistText] = useState("");
  const [comment, setComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    TaskService.getTaskById(Number(id))
      .then(setTask)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const updateTaskStatus = async (statusName: string) => {
    try {
      await api.patch(`/TaskItem/${task?.id}/status`, { statusName });
      const updatedTask = await TaskService.getTaskById(Number(id));
      setTask(updatedTask);
    } catch (err) {
      setError("Failed to update task status");
    }
  };

  const evaluateChecklistStatus = async (updatedTask: Task) => {
    const completed = updatedTask.checklistItems.filter(i => i.isCompleted).length;
    const total = updatedTask.checklistItems.length;

    if (total === 0) return;

    const currentStatus = updatedTask.status?.name;

    if (currentStatus === "On Hold") return;

    if (completed === 0 && currentStatus !== "To Do") {
      await updateTaskStatus("To Do");
    } else if (completed > 0 && completed < total && currentStatus !== "In Progress") {
      await updateTaskStatus("In Progress");
    } else if (completed === total && currentStatus !== "Done") {
      await updateTaskStatus("Done");
    }
  };

  const toggleChecklistItem = async (checklistId: number) => {
    try {
      await api.patch(`/Checklist/${checklistId}/toggle`);
      const updatedTask = await TaskService.getTaskById(Number(id));
      setTask(updatedTask);
      await evaluateChecklistStatus(updatedTask);
    } catch (err) {
      setError("Failed to update checklist item");
    }
  };

  const addChecklistItem = async () => {
    if (!newChecklistText.trim() || !task) return;
    try {
      await api.post(`/Checklist/${task.id}`, {
        items: [{ description: newChecklistText }],
      });
      const updatedTask = await TaskService.getTaskById(Number(id));
      setTask(updatedTask);
      setNewChecklistText("");
      await evaluateChecklistStatus(updatedTask);
    } catch (err) {
      setError("Failed to add checklist item");
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim() || !task) return;
    try {
      await api.post(`/Comment/${task.id}`, { content: comment });
      const updatedTask = await TaskService.getTaskById(Number(task.id));
      setTask(updatedTask);
      setComment("");
    } catch (err) {
      setError("Failed to add comment");
    }
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editedContent.trim()) return;
    try {
      await api.put(`/Comment/${commentId}`, { content: editedContent });
      const updatedTask = await TaskService.getTaskById(Number(id));
      setTask(updatedTask);
      setEditingCommentId(null);
      setEditedContent("");
    } catch (err) {
      setError("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await api.delete(`/Comment/${commentId}`);
      const updatedTask = await TaskService.getTaskById(Number(id));
      setTask(updatedTask);
    } catch (err) {
      setError("Failed to delete comment");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="danger">Task not found.</Alert>
      </div>
    );
  }

  const completedChecklistItems = task.checklistItems.filter(item => item.isCompleted).length;
  const totalChecklistItems = task.checklistItems.length;
  const progressPercentage = totalChecklistItems > 0 
    ? Math.round((completedChecklistItems / totalChecklistItems) * 100) 
    : 0;

  const canAddChecklist = user?.role === "Admin" || task.createdById === user?.id;

  return (
    <div 
      className="container-fluid py-4 px-4" 
      style={{ backgroundColor: '#ffff', minHeight: '100vh', width: '100%' }}
    >
      <div className="row justify-content-center">

          {/* Error Alert */}
          {error && (
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              {error}
            </Alert>
          )}

          <div className="mb-4">

            {/* Title and Exit Button Rows */}
            <div className="d-flex flex-column justify-content-between align-items-center mb-2">
              <Button 
                variant="outline-primary"
                onClick={() => navigate("/tasks")} 
                className="ms-2 mb-2"
                style={{ minWidth: '100px' }}
                size="sm"
              >
                Exit
              </Button>
              <h1 
                  className="text-truncate m-0"
                  style={{ 
                    color: '#6a6dfb', 
                    fontSize: 'clamp(1rem, 5vw, 2rem)'
                  }}
                >
                  {task.title}
              </h1>

              <div className="d-flex flex-wrap gap-3 text-muted mb-3 pt-3" style={{ fontSize: "clamp(0.75rem, 1vw, 0.90rem)" }}>
                <div><strong>Created:</strong> {task.dateCreated ? new Date(task.dateCreated).toLocaleString() : "Unknown"}</div>
                <div><strong>Due:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleString() : "No due date"}</div>
              </div>
            </div>
            
            {/* Category, Priority, Status Row */}
            <div className="d-flex flex-wrap gap-2 justify-content-center align-items-center">
              <span className="status-pill text-light" style={{ backgroundColor: "#078b83",padding: "0.25rem 0.4rem " }}>
                {task.category?.name || 'Uncategorized'}
              </span>
              <span className={`status-pill ${
                task.priority?.name === "High" ? "bg-danger"
                : task.priority?.name === "Medium" ? "bg-warning text-dark"
                : "bg-success"
              }`} style={{ padding: "0.25rem 0.4rem" }}>
                {task.priority?.name || 'Low'}
              </span>
              <span className="status-pill" style={{ backgroundColor: getStatusColor(task.status?.name || "") }}>
                {task.status?.name || "Unknown"}
              </span>
            </div>
          </div>

          {/* Task Description */}
          <div className="bg-white p-4 rounded shadow-sm mb-4">
            <p className="text-muted mb-4"  style={{ fontSize: "clamp(0.75rem, 3vw, 0.95rem)" }}>{task.description || "No description"}</p>

             

            {/* Created by and Assigned Users */}
            <div className="row mb-4"  style={{ fontSize: "clamp(0.75rem, 2vw, 1rem)" }}>
              <div className="col-12 col-md-6">
                <div><strong>Created by:</strong> 
                  <div className="d-flex align-items-center">
                    <img 
                      src={task.createdBy?.avatar || '/path/to/default-avatar.png'} 
                      alt="avatar" 
                      className="rounded-circle me-2 img-fluid" 
                      width={32} 
                      height={32} 
                    />
                    <span>{task.createdBy?.fullName}</span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div><strong>Assigned to:</strong>{" "}
                  {task.assignedUsers.map((user) => (
                    <div key={user.userId} className="d-flex align-items-center mb-2">
                      <img 
                        src={user.avatar || '/path/to/default-avatar.png'} 
                        alt="avatar" 
                        className="rounded-circle me-2 img-fluid" 
                        width={32} 
                        height={32} 
                      />
                      <span>{user.fullName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-white p-4 rounded shadow-sm mb-4"  style={{ fontSize: "clamp(0.75rem, 2vw, 1rem)" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 style={{ color: '#6a6dfb' }} className="text-truncate">Checklist</h5>
              {totalChecklistItems > 0 && (
                <div className="d-flex align-items-center">
                  <span className="me-2">{completedChecklistItems}/{totalChecklistItems}</span>
                  <ProgressBar 
                    now={progressPercentage} 
                    style={{ width: '150px', height: '10px' }} 
                    variant={progressPercentage === 100 ? 'success' : 'primary'}
                  />
                </div>
              )}
            </div>

            <ListGroup className="mb-3">
              {task.checklistItems.length > 0 ? (
                task.checklistItems.map((item) => (
                  <ListGroup.Item key={item.id} className="d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      checked={item.isCompleted}
                      onChange={() => toggleChecklistItem(item.id)}
                      label={item.description}
                      className="flex-grow-1"
                    />
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-muted">No checklist items</ListGroup.Item>
              )}
            </ListGroup>

            {canAddChecklist && (
              <div className="d-flex mt-2">
                <Form.Control
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  placeholder="New checklist item"
                  className="me-2"
                />
                <Button 
                  onClick={addChecklistItem} 
                  style={{ backgroundColor: '#6a6dfb', borderColor: '#6a6dfb' }}
                  className="w-auto"
                >
                  Add
                </Button>
              </div>
            )}
          </div>

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <div className="bg-white p-4 rounded shadow-sm mb-4">
              <h5 style={{ color: '#6a6dfb' }} className="mb-3">Attachments</h5>
              <ListGroup>
                {task.attachments.map((attachment) => (
                  <ListGroup.Item key={attachment.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{attachment.fileName}</strong>
                      <div className="text-muted small">{attachment.contentType}</div>
                    </div>
                    <a
                      href={attachment.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary btn-sm"
                    >
                      View
                    </a>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}

          {/* Comments */}
          
          <div className="bg-white p-4 rounded shadow-sm">
            <h5 style={{ color: '#6a6dfb' }} className="mb-3">Comments</h5>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto' }} className="mb-3">
              {task.comments.length > 0 ? (
                <ListGroup>
                  {task.comments.map((comment) => (
                    <ListGroup.Item key={comment.id} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <img
                            src={comment.userAvatar}
                            alt="avatar"
                            className="rounded-circle me-2 img-fluid"
                            width={32}
                            height={32}
                          />
                          <strong>{comment.userName}</strong>
                        </div>
                        <small className="text-muted">
                          {new Date(comment.dateCreated).toLocaleString()}
                        </small>
                      </div>

                      {editingCommentId === comment.id ? (
                        <>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="mt-2 mb-2"
                          />
                          <div className="d-flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleUpdateComment(comment.id)}
                              style={{ backgroundColor: '#6a6dfb', borderColor: '#6a6dfb' }}
                            >
                              Save
                            </Button>
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              onClick={() => setEditingCommentId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="mb-2">{comment.content}</p>
                          {comment.userId === user?.id && (
                              <div className="d-flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => {
                                    setEditingCommentId(comment.id);
                                    setEditedContent(comment.content);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => handleDeleteComment(comment.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            )}
                        </>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted">No comments yet</p>
              )}
            </div>

            <Form.Control
              as="textarea"
              rows={3}
              className="mt-3 mb-2"
              value={comment}
              placeholder="Write a comment..."
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              onClick={handleCommentSubmit}
              disabled={!comment.trim()}
              style={{ backgroundColor: '#6a6dfb', borderColor: '#6a6dfb' }}
            >
              Add Comment
            </Button>
          </div>
        </div>
      </div>
  );
};

export default TaskDetailsPage;

