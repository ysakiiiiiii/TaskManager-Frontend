import React, { useEffect, useState } from "react";
import {
  Button, Form, Table, Alert, Card, Row, Col, Modal,
} from "react-bootstrap";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reassignAndDeleteCategory,
} from "../services/categoryService";
import type { AddCategoryRequestDto, UpdateCategoryRequestDto } from "../interfaces/category";
import { useNavigate } from "react-router-dom";

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [newCategoryId, setNewCategoryId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await getCategories();
    if (response.success) setCategories(response.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editId === null) {
        const newCategory: AddCategoryRequestDto = { name };
        await createCategory(newCategory);
        setSuccess("Category created successfully");
      } else {
        const updatedCategory: UpdateCategoryRequestDto = { name };
        await updateCategory(editId, updatedCategory);
        setSuccess("Category updated successfully");
      }

      setName("");
      setEditId(null);
      fetchCategories();
    } catch (err) {
      setError("Failed to save category");
    }
  };

  const handleEdit = (id: number, currentName: string) => {
    setEditId(id);
    setName(currentName);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setName("");
  };

  const handleDelete = async (id: number) => {
  if (!window.confirm("Are you sure you want to delete this category?")) return;

  try {
    const res = await deleteCategory(id);
    if (res.success) {
      setSuccess("Category deleted successfully.");
      fetchCategories();
    } else {
      throw new Error("Delete failed.");
    }
  } catch (err: any) {
    setCategoryToDelete(id);
    setShowReassignModal(true);
  }
};


  const handleReassignAndDelete = async () => {
    if (!categoryToDelete || !newCategoryId) return;

    try {
      await reassignAndDeleteCategory(categoryToDelete, newCategoryId);
      setShowReassignModal(false);
      setCategoryToDelete(null);
      setNewCategoryId(null);
      fetchCategories();
      setSuccess("Tasks reassigned and category deleted.");
    } catch (err) {
      setError("Failed to reassign and delete category.");
    }
  };

  return (
    <div className="card border-0 shadow-sm min-vh-100 d-flex">
      <div className="mt-4 p-5 bg-white rounded-3">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Manage Categories</h3>
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
              Exit
            </Button>
          </div>

          {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
          {success && <Alert variant="success" dismissible onClose={() => setSuccess("")}>{success}</Alert>}
          <Form onSubmit={handleSubmit} className="mb-4">
            <Form.Group className="mb-3" controlId="categoryName">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter category name"
              />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" className="text-white">
                {editId === null ? "Add Category" : "Update Category"}
              </Button>
              {editId !== null && (
                <Button variant="outline-secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </Form>

          <div className="table-responsive">
            <table className="table table-bordered align-middle table-fixed w-100">
              <thead className="table-dark">
                <tr>
                  <th>Category Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat: any) => (
                  <tr key={cat.id}>
                    <td>{cat.name}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleEdit(cat.id, cat.name)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(cat.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>

      {/* Reassign Modal */}
      <Modal show={showReassignModal} onHide={() => setShowReassignModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reassign Tasks Before Deleting</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select a new category to reassign tasks:</Form.Label>
            <Form.Select
              value={newCategoryId ?? ""}
              onChange={(e) => setNewCategoryId(Number(e.target.value))}
            >
              <option value="">-- Select Category --</option>
              {categories
                .filter((cat: any) => cat.id !== categoryToDelete)
                .map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReassignModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleReassignAndDelete}
            disabled={!newCategoryId}
          >
            Reassign & Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
