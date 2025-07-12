import React, { useState, useEffect } from "react";
import {
  Button, Form, Row, Col, Dropdown, InputGroup, ListGroup,
  Alert,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useCategoryFilter from "../hooks/useCategoryFilter";
import { getUsers } from "../services/userService";
import { TaskService } from "../services/taskServices";
import { FaTimes, FaPaperclip } from "react-icons/fa";
import type { TaskUpdateDto, Attachment, IdNameDto, AssignedUser } from "../interfaces/task";
import { isFutureDate } from "../utils/dateUtils";

interface ChecklistItem {
  id?: number;      
  description: string;
  isCompleted?: boolean;
}
interface FormData {
  title: string;
  description: string;
  categoryId: string;
  priorityId: string;
  statusId: string;
  dueDate: string;
  assignedUserIds: string[];
  checklistItems: ChecklistItem[];
}

const Checklist = ({ items, updateItem, addItem, removeItem }: {
  items: ChecklistItem[];
  updateItem: (index: number, value: string) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
}) => (
  <div>
    {items.map((item, idx) => (
      <div key={idx} className="d-flex mb-2 gap-2">
        <Form.Control
          value={item.description}
          onChange={(e) => updateItem(idx, e.target.value)}
          placeholder={`Checklist item ${idx + 1}`}
          className="border-2"
        />
        <Button
          variant="outline-danger"
          onClick={() => removeItem(idx)}
          className="d-flex align-items-center justify-content-center"
          style={{ width: "40px" }}
        >
          &times;
        </Button>
      </div>
    ))}
    <Button variant="outline-secondary" onClick={addItem}>
      + Add Checklist Item
    </Button>
  </div>
);

const AttachmentSection = ({ files, onFileChange, onRemove }: {
  files: (File | Attachment)[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}) => (
  <div>
    <div className="border-2 rounded p-3 mb-3" style={{ borderStyle: "dashed" }}>
      <div className="text-center">
        <FaPaperclip size={24} className="mb-2" />
        <p>Drag & drop files here or click to browse</p>
        <Form.Control
          type="file"
          multiple
          onChange={onFileChange}
          className="d-none"
          id="file-upload"
        />
        <Button
          variant="outline-primary"
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          Select Files
        </Button>
      </div>
    </div>

    {files.length > 0 && (
      <ListGroup>
        {files.map((file, index) => (
          <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <FaPaperclip className="me-2" />
              <span className="text-truncate" style={{ maxWidth: "300px" }}>
                {'name' in file ? file.name : file.fileName}
              </span>
              {'size' in file && (
                <small className="text-muted ms-2">({(file.size / 1024).toFixed(2)} KB)</small>
              )}
            </div>
            <Button
              variant="link"
              onClick={() => onRemove(index)}
              className="p-0 text-danger"
              title="Remove file"
            >
              <FaTimes />
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    )}
  </div>
);

const UserDropdown = ({ showDropdown, setShowDropdown, users, selectedId, setSelectedId, searchTerm, setSearchTerm }: {
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  users: { id: string; name: string }[];
  selectedId: string[];
  setSelectedId: (ids: string[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) => {
  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dropdown show={showDropdown} onToggle={setShowDropdown}>
      <Dropdown.Toggle as={InputGroup} className="w-100 border-2 p-0" style={{ backgroundColor: "white" }}>
        <Form.Control
          placeholder="Search and select a user"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={() => setShowDropdown(true)}
          className="border-0"
        />
      </Dropdown.Toggle>
      <Dropdown.Menu className="w-100 p-0" style={{ maxHeight: "300px", overflowY: "auto" }}>
        {filtered.length === 0 ? (
          <Dropdown.Item disabled>No users found</Dropdown.Item>
        ) : (
          filtered.map((u) => (
            <Dropdown.Item 
              key={u.id} 
              onClick={() => {
                const newIds = selectedId.includes(u.id)
                  ? selectedId.filter(id => id !== u.id)
                  : [...selectedId, u.id];
                setSelectedId(newIds);
              }}
            >
              <Form.Check
                type="checkbox"
                checked={selectedId.includes(u.id)}
                label={u.name}
                readOnly
              />
            </Dropdown.Item>
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default function EditTaskPage() {
  const { taskId } = useParams<{ taskId: string }>(); 
  const { role, user, loading } = useAuth();
  const navigate = useNavigate();
  const { filters } = useCategoryFilter();

  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<(File | Attachment)[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [removedAttachmentIds, setRemovedAttachmentIds] = useState<number[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    categoryId: "",
    priorityId: "",
    statusId: "",
    dueDate: "",
    assignedUserIds: [],
    checklistItems: [{ description: "" }],
  });

  const removeFile = (index: number) => {
  setSelectedFiles(prev => {
    const fileToRemove = prev[index];

    if (!('size' in fileToRemove) && 'id' in fileToRemove) {
      setRemovedAttachmentIds(ids => [...ids, fileToRemove.id]);
    }

    return prev.filter((_, i) => i !== index);
  });
};


  useEffect(() => {
    const fetchUsers = async () => {
      if (loading || !user) return;
      const data = await getUsers(true, 1, 0);
      const filtered = data.items.filter((u) =>
        u.id !== user.id && (role === "admin" || u.role !== "admin")
      );
      setUsers(filtered.map((u) => ({ id: u.id, name: `${u.firstName} ${u.lastName}` })));
    };
    fetchUsers();
  }, [role, user, loading]);

    useEffect(() => {
      const fetchTask = async () => {
        if (!taskId) {console.log("Nothing")
           return;}
        const task = await TaskService.getTaskById(Number(taskId));
        console.log('API Response:', task);
          if (task.createdBy) {
    console.log('Created By:', task.createdBy);
  }
        setFormData({
          title: task.title,
          description: task.description,
          categoryId: task.categoryId.toString(),
          priorityId: task.priorityId.toString(),
          statusId: task.statusId.toString(),
          dueDate: task.dueDate ? task.dueDate.slice(0, 16) : "",
          assignedUserIds: task.assignedUsers.map(u => u.userId),
          checklistItems: task.checklistItems.map(item => ({ 
            description: item.description 
          })),
        });

        setSelectedFiles(task.attachments || []);
        
        if (task.assignedUsers.length > 0) {
          setSearchTerm(task.assignedUsers[0].fullName);
        }
      };

      fetchTask();
    }, [taskId]);

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateChecklistItem = (index: number, value: string) => {
    const updated = [...formData.checklistItems];
    updated[index].description = value;
    handleChange("checklistItems", updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskId) {
      window.alert("Missing task ID.");
      return;
    }

    const {
      title,
      categoryId,
      priorityId,
      statusId,
      description,
      dueDate,
      assignedUserIds,
      checklistItems,
    } = formData;

    if (!title.trim() || !categoryId || !priorityId || !statusId) {
      window.alert("Please fill out all required fields.");
      return;
    }

    if (dueDate && !isFutureDate(dueDate)) {
      window.alert("Due date must be in the future.");
      return;
    }

    const validChecklistItems = checklistItems.filter(item => item.description.trim() !== "");
    const validAttachments = selectedFiles.filter(file => file instanceof File);

    const payload: TaskUpdateDto = {
      id: Number(taskId),
      title: title.trim(),
      description: description.trim(),
      categoryId: +categoryId,
      priorityId: +priorityId,
      statusId: +statusId,
      assignedUserIds,
      checklistItems: validChecklistItems.map(item => ({
        id: item.id || 0,
        description: item.description.trim(),
        isCompleted: item.isCompleted || false,
      })),
      ...(dueDate && { dueDate }),
    };

    try {
      const updatedTask = await TaskService.updateTask(Number(taskId), payload, validChecklistItems);

      for (const file of validAttachments) {
        await TaskService.uploadAttachment(updatedTask.id, file);
      }

      if (removedAttachmentIds.length > 0) {
        for (const id of removedAttachmentIds) {
          try {
            await TaskService.deleteAttachment(id);
          } catch (err: any) {
            if (err.response?.status !== 404) {
              console.error("Failed to delete attachment", err);
            }
          }
        }
      }


      window.alert("Task updated successfully!");
      navigate(`/tasks`);
    } catch (error) {
      console.error(error);
      window.alert("Failed to update task.");
    }
  };



  return (
    <div className="card border-0 shadow-sm min-vh-100 d-flex">
      <div className="mt-4 p-5 bg-white rounded-3">
        <h3 className="mb-4" style={{ color: "#6a6dfb" }}>Edit Task</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              required
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="border-2"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="border-2"
            />
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  required
                  value={formData.categoryId}
                  onChange={(e) => handleChange("categoryId", e.target.value)}
                  className="border-2"
                >
                  <option value="">Select category</option>
                  {filters.categories.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  required
                  value={formData.priorityId}
                  onChange={(e) => handleChange("priorityId", e.target.value)}
                  className="border-2"
                >
                  <option value="">Select priority</option>
                  {filters.priorities.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  required
                  value={formData.statusId}
                  onChange={(e) => handleChange("statusId", e.target.value)}
                  className="border-2"
                >
                  <option value="">Select status</option>
                  {filters.statuses.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
              />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Assign To</Form.Label>
            <UserDropdown
              showDropdown={showUserDropdown}
              setShowDropdown={setShowUserDropdown}
              users={users}
              selectedId={formData.assignedUserIds}
              setSelectedId={(ids) => handleChange("assignedUserIds", ids)}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Checklist Items</Form.Label>
            <Checklist
              items={formData.checklistItems}
              updateItem={updateChecklistItem}
              addItem={() => handleChange("checklistItems", [...formData.checklistItems, { description: "" }])}
              removeItem={(i) => {
                const items = [...formData.checklistItems];
                items.splice(i, 1);
                handleChange("checklistItems", items);
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Attachments</Form.Label>
            <AttachmentSection
              files={selectedFiles}
              onFileChange={handleFileUpload}
              onRemove={removeFile}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="outline-secondary" onClick={() => navigate("/tasks")}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              style={{ backgroundColor: "#6a6dfb", borderColor: "#6a6dfb" }}
              disabled={!formData.title || !formData.categoryId || !formData.priorityId || !formData.statusId}
            >
              Update Task
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}