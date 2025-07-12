import React, { useState, useEffect } from "react";
import {
Button,
Form,
Row,
Col,
Dropdown,
InputGroup,
ListGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useCategoryFilter from "../hooks/useCategoryFilter";
import { getUsers } from "../services/userService";
import { TaskService } from "../services/taskServices";
import { FaTimes, FaPaperclip } from "react-icons/fa";
import type { TaskCreateDto } from "../interfaces/task";
import { isFutureDate } from "../utils/dateUtils";

export default function AddTaskPage() {
const { role,user, loading} = useAuth();
const navigate = useNavigate();
const { filters } = useCategoryFilter();

const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
const [searchTerm, setSearchTerm] = useState("");
const [showUserDropdown, setShowUserDropdown] = useState(false);
const [showToast, setShowToast] = useState(false);
const [errorToast, setErrorToast] = useState<{ show: boolean; message: string }>({
show: false,
message: "",
});


const showError = (message: string) => {
  setErrorToast({ show: true, message });
  setTimeout(() => {
    setErrorToast({ show: false, message: "" });
  }, 3000);
};



const [formData, setFormData] = useState({
   title: "",
   description: "",
   categoryId: "",
   priorityId: "",
   statusId: "",
   dueDate: "",
   assignedUserIds: [] as string[],
   checklistItems: [{ description: "" }],
});

useEffect(() => {
  const fetchUsers = async () => {
    if (loading || !user) return;

    const data = await getUsers(true, 1, 0);

    const filtered = data.items.filter((u) => {
      if (u.id === user.id) return false; 
      if (role !== "admin" && u.role === "admin") return false;
      return true;
    });

    setUsers(
      filtered.map((u) => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
      }))
    );
  };

  fetchUsers();
}, [role, user, loading]);


const handleChange = (field: string, value: any) => {
   setFormData((prev) => ({ ...prev, [field]: value }));
};

const updateChecklistItem = (index: number, value: string) => {
   const newItems = [...formData.checklistItems];
   newItems[index].description = value;
   handleChange("checklistItems", newItems);
};

const addChecklistItem = () => {
   handleChange("checklistItems", [
   ...formData.checklistItems,
   { description: "" },
   ]);
};

const removeChecklistItem = (index: number) => {
   const newItems = [...formData.checklistItems];
   newItems.splice(index, 1);
   handleChange("checklistItems", newItems);
};

const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
   if (e.target.files) {
   const newFiles = Array.from(e.target.files);
   setSelectedFiles((prev) => [...prev, ...newFiles]);
   }
};

const removeFile = (index: number) => {
   setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
};

const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();

   const categoryId = Number(formData.categoryId);
   const priorityId = Number(formData.priorityId);
   const statusId = Number(formData.statusId);

   if (!categoryId || !priorityId || !statusId) {
      showError("Please select valid category, priority, and status.");
      return;
   }

   if (!formData.title.trim()) {
      showError("Title is required.");
      return;
   }

   if (formData.dueDate && !isFutureDate(formData.dueDate)) {
      showError("Due date must be in the future.");
      return;
   }

   if (formData.assignedUserIds.length === 0) {
      showError("Please assign at least one user.");
      return;
   }
   const payload: TaskCreateDto = {
   title: formData.title.trim(),
   description: formData.description.trim(),
   categoryId,
   priorityId,
   statusId,
   assignedUserIds: formData.assignedUserIds,
   ...(formData.dueDate && { dueDate: formData.dueDate }),
   };

   try {
   await TaskService.createFullTask(
      payload,
      formData.checklistItems,
      selectedFiles
   );
   setShowToast(true);
   setTimeout(() => {
      navigate("/tasks");
   }, 1500);
   } catch (error) {
      showError("Failed to create task. Please try again.");
   }
};

const filteredUsers = users.filter((user) =>
   user.name.toLowerCase().includes(searchTerm.toLowerCase())
);


return (
   <div className="card border-0 shadow-sm min-vh-100 d-flex">
   <div className=" mt-4 p-5 bg-white rounded-3">
      <h3 className="mb-4" style={{ color: "#6a6dfb" }}>
         Create New Task
      </h3>
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
               {filters.categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                     {cat.name}
                  </option>
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
               {filters.priorities.map((p) => (
                  <option key={p.id} value={p.id}>
                     {p.name}
                  </option>
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
               {filters.statuses.map((s) => (
                  <option key={s.id} value={s.id}>
                     {s.name}
                  </option>
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
            className="border-2"
         />
         </Form.Group>

         <Form.Group className="mb-3">
         <Form.Label>Assign To</Form.Label>
         <Dropdown
            show={showUserDropdown}
            onToggle={(isOpen) => setShowUserDropdown(isOpen)}
         >
            <Dropdown.Toggle
               as={InputGroup}
               className="w-100 border-2 p-0"
               style={{ backgroundColor: "white" }}
            >
               <Form.Control
               placeholder="Search and select a user"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               onClick={() => setShowUserDropdown(true)}
               className="border-0"
               />
            </Dropdown.Toggle>

            <Dropdown.Menu
               className="w-100 p-0"
               style={{ maxHeight: "300px", overflowY: "auto" }}
            >
               {filteredUsers.length === 0 ? (
               <Dropdown.Item disabled>No users found</Dropdown.Item>
               ) : (
               filteredUsers.map((u) => (
                  <Dropdown.Item
                     key={u.id}
                     as="div"
                     className="d-flex align-items-center px-3 py-2"
                     onClick={() => handleChange("assignedUserIds", [u.id])}
                  >
                     <Form.Check
                     type="radio"
                     checked={formData.assignedUserIds[0] === u.id}
                     onChange={() => {}}
                     label={u.name}
                     className="w-100"
                     />
                  </Dropdown.Item>
               ))
               )}
            </Dropdown.Menu>
         </Dropdown>

         {formData.assignedUserIds.length > 0 && (
            <div className="mt-2">
               <small className="text-muted">Assigned user:</small>
               <div className="d-flex flex-wrap gap-2 mt-1">
               {users
                  .filter((u) => u.id === formData.assignedUserIds[0])
                  .map((user) => (
                     <span
                     key={user.id}
                     className="badge rounded-pill"
                     style={{ backgroundColor: "#6a6dfb" }}
                     >
                     {user.name}
                     </span>
                  ))}
               </div>
            </div>
         )}
         </Form.Group>

         <Form.Group className="mb-3">
         <Form.Label>Checklist Items</Form.Label>
         {formData.checklistItems.map((item, idx) => (
            <div key={idx} className="d-flex mb-2 gap-2">
               <Form.Control
               value={item.description}
               onChange={(e) => updateChecklistItem(idx, e.target.value)}
               placeholder={`Checklist item ${idx + 1}`}
               className="border-2"
               />
               <Button
               variant="outline-danger"
               onClick={() => removeChecklistItem(idx)}
               className="d-flex align-items-center justify-content-center"
               style={{ width: "40px" }}
               >
               &times;
               </Button>
            </div>
         ))}
         <Button variant="outline-secondary" onClick={addChecklistItem}>
            + Add Checklist Item
         </Button>
         </Form.Group>

         <Form.Group className="mb-4">
         <Form.Label>Attachments</Form.Label>
         <div
            className="border-2 rounded p-3 mb-3"
            style={{ borderStyle: "dashed" }}
         >
            <div className="text-center">
               <FaPaperclip size={24} className="mb-2" />
               <p>Drag & drop files here or click to browse</p>
               <Form.Control
               type="file"
               multiple
               onChange={handleFileUpload}
               className="d-none"
               id="file-upload"
               />
               <Button
               variant="outline-primary"
               onClick={() =>
                  document.getElementById("file-upload")?.click()
               }
               >
               Select Files
               </Button>
            </div>
         </div>

         {selectedFiles.length > 0 && (
            <ListGroup>
               {selectedFiles.map((file, index) => (
               <ListGroup.Item
                  key={index}
                  className="d-flex justify-content-between align-items-center"
               >
                  <div className="d-flex align-items-center">
                     <FaPaperclip className="me-2" />
                     <span
                     className="text-truncate"
                     style={{ maxWidth: "300px" }}
                     >
                     {file.name}
                     </span>
                     <small className="text-muted ms-2">
                     ({(file.size / 1024).toFixed(2)} KB)
                     </small>
                  </div>
                  <Button
                     variant="link"
                     onClick={() => removeFile(index)}
                     className="p-0 text-danger"
                     title="Remove file"
                  >
                     <FaTimes />
                  </Button>
               </ListGroup.Item>
               ))}
            </ListGroup>
         )}
         </Form.Group>

         <div className="d-flex justify-content-end gap-2">
         <Button variant="outline-secondary" onClick={() => navigate("/tasks")}>
            Cancel
         </Button>
         <Button
            type="submit"
            variant="primary"
            style={{ backgroundColor: "#6a6dfb", borderColor: "#6a6dfb" }}
            disabled={
               !formData.title ||
               !formData.categoryId ||
               !formData.priorityId ||
               !formData.statusId
            }
         >
            Save Task
         </Button>
         </div>
      </Form>

  
    {/* Toast Container */}
      <div
      className="position-fixed top-0 start-50 translate-middle-x p-3"
      style={{ zIndex: 1060 }}
      >
      {/* Success Toast */}
      <div
         className={`toast align-items-center text-white bg-success border-0 mb-2 ${showToast ? 'show' : 'hide'}`}
         role="alert"
         aria-live="assertive"
         aria-atomic="true"
      >
         <div className="d-flex">
            <div className="toast-body">Task created successfully!</div>
            <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={() => setShowToast(false)}
            ></button>
         </div>
      </div>

      {/* Error Toast */}
      <div
         className={`toast align-items-center text-white bg-danger border-0 ${errorToast.show ? 'show' : 'hide'}`}
         role="alert"
         aria-live="assertive"
         aria-atomic="true"
      >
         <div className="d-flex">
            <div className="toast-body">{errorToast.message}</div>
            <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={() => setErrorToast({ show: false, message: "" })}
            ></button>
         </div>
      </div>
      </div>
      </div>
   </div>
);
}
