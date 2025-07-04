// src/components/TaskTable.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table, Card, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

// Define types for Task, Checklist, Attachment, etc.
type AssignedUser = {
  taskId: number;
  userId: string;
};

type ChecklistItem = {
  id: number;
  description: string;
  isCompleted: boolean;
};

type Attachment = {
  id: number;
  fileName: string;
  fileExtension: string;
  filePath: string;
  dateUploaded: string;
  uploadedById: string;
};

type Task = {
  id: number;
  title: string;
  description: string;
  createdById: string;
  categoryId: number;
  priorityId: number;
  statusId: number;
  dateCreated: string;
  dateModified: string | null;
  dueDate: string;
  assignedUsers: AssignedUser[];
  checklistItems: ChecklistItem[];
  comments: any[];
  attachments: Attachment[];
};

const TaskTable: React.FC = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'box'>('list');

  useEffect(() => {
    axios
      .get('https://localhost:7179/api/TaskItem/2')
      .then((res) => {
        setTask(res.data.data);
      })
      .catch((err) => console.error('Error fetching task:', err));
  }, []);

  if (!task) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{task.title}</h2>
        <ToggleButtonGroup type="radio" name="view" defaultValue={viewMode} onChange={(val) => setViewMode(val)}>
          <ToggleButton id="list" value={'list'} variant="outline-primary">List View</ToggleButton>
          <ToggleButton id="box" value={'box'} variant="outline-secondary">Box View</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleString()}</p>

      <h4 className="mt-4">Checklist</h4>
      {viewMode === 'list' ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {task.checklistItems.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.description}</td>
                <td>{item.isCompleted ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="row">
          {task.checklistItems.map(item => (
            <div className="col-md-4 mb-3" key={item.id}>
              <Card border={item.isCompleted ? "success" : "danger"}>
                <Card.Body>
                  <Card.Title>#{item.id}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Card.Text>Status: {item.isCompleted ? '✅ Completed' : '❌ Not Completed'}</Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}

      <h4 className="mt-4">Attachments</h4>
      {viewMode === 'list' ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>File Name</th>
              <th>Type</th>
              <th>Date Uploaded</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {task.attachments.map(file => (
              <tr key={file.id}>
                <td>{file.id}</td>
                <td>{file.fileName}</td>
                <td>{file.fileExtension}</td>
                <td>{new Date(file.dateUploaded).toLocaleString()}</td>
                <td>
                  <a href={file.filePath} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary">
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="row">
          {task.attachments.map(file => (
            <div className="col-md-4 mb-3" key={file.id}>
              <Card>
                <Card.Body>
                  <Card.Title>{file.fileName}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{file.fileExtension}</Card.Subtitle>
                  <Card.Text>Uploaded: {new Date(file.dateUploaded).toLocaleString()}</Card.Text>
                  <Button variant="primary" href={file.filePath} target="_blank" rel="noreferrer">Download</Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskTable;
