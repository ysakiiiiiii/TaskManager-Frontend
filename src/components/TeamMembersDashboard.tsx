import React, { useState } from "react";
import { Table, Container, Button, Badge, Form, Image, Dropdown, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

interface TaskStatus {
  id: number;
  name: string;
}

interface TaskItem {
  id: number;
  title: string;
  description: string;
  statusId: number;
  status: TaskStatus;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  role: string;
  tasks: TaskItem[];
}

const statusLabels: Record<number, string> = {
  1: "To Do",
  2: "In Progress",
  3: "Done",
  4: "On Hold",
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "To Do": return "#fcb329";
    case "In Progress": return "#0d6efd";
    case "Done": return "#20b478";
    case "On Hold": return "#6610f2";
    default: return "#4caf50";
  }
};

const teamMembers: User[] = [
  {
    id: "1",
    firstName: "Dustin",
    lastName: "Smith",
    email: "dustin@timetoprogram.com",
    isActive: true,
    role: "Developer",
    tasks: [
      { id: 1, title: "Fix bug", description: "Resolve login issue", statusId: 2, status: { id: 2, name: "In Progress" } },
      { id: 2, title: "Add feature", description: "Implement auth", statusId: 3, status: { id: 3, name: "Done" } },
      { id: 5, title: "Code review", description: "Review PR #42", statusId: 1, status: { id: 1, name: "To Do" } }
    ]
  },
  {
    id: "2",
    firstName: "Mary",
    lastName: "Jane",
    email: "mary@timetoprogram.com",
    isActive: false,
    role: "Designer",
    tasks: [
      { id: 3, title: "UI Review", description: "Review dashboard UI", statusId: 1, status: { id: 1, name: "To Do" } },
      { id: 4, title: "Icon Set", description: "Design new icons", statusId: 4, status: { id: 4, name: "On Hold" } }
    ]
  },
  {
    id: "3",
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex@timetoprogram.com",
    isActive: true,
    role: "Product Manager",
    tasks: [
      { id: 6, title: "Roadmap", description: "Update Q3 roadmap", statusId: 2, status: { id: 2, name: "In Progress" } },
      { id: 7, title: "User research", description: "Conduct interviews", statusId: 3, status: { id: 3, name: "Done" } },
      { id: 8, title: "Metrics", description: "Analyze KPIs", statusId: 1, status: { id: 1, name: "To Do" } }
    ]
  }
];

const getAvatarUrl = (name: string) => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
};

const StatusCountBadge = ({ count, statusId }: { count: number, statusId: number }) => {
  const statusName = statusLabels[statusId];
  const color = getStatusColor(statusName);
  
  return (
    <div 
      style={{ 
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: `${color}20`,
        color: color,
        fontWeight: 'bold',
        fontSize: '0.9rem',
        border: `1px solid ${color}80`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}
    >
      {count}
    </div>
  );
};

const TeamMemberListView = ({ users, toggleStatus }: { users: User[], toggleStatus: (id: string) => void }) => {
  return (
    <div className="table-responsive" style={{ 
      borderRadius: '0.5rem',
      boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
      overflowX: 'auto'
    }}>
      <Table hover className="mb-0 align-middle" style={{ minWidth: '900px' }}>
        <thead className="table-light">
          <tr>
            <th style={{ width: '25%', minWidth: '200px' }}>Team Member</th>
            <th style={{ width: '20%', minWidth: '180px' }}>Contact</th>
            <th style={{ width: '10%', minWidth: '100px' }}>Status</th>
            <th style={{ width: '10%', minWidth: '90px' }} className="text-center">To Do</th>
            <th style={{ width: '10%', minWidth: '90px' }} className="text-center">In Progress</th>
            <th style={{ width: '10%', minWidth: '90px' }} className="text-center">On Hold</th>
            <th style={{ width: '10%', minWidth: '90px' }} className="text-center">Done</th>
            <th style={{ width: '5%', minWidth: '50px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((member) => (
            <tr key={member.id}>
              <td>
                <div className="d-flex align-items-center">
                  <Image 
                    src={getAvatarUrl(`${member.firstName} ${member.lastName}`)} 
                    alt="avatar"
                    roundedCircle
                    width={42}
                    height={42}
                    className="me-3 border border-2 border-white shadow-sm"
                  />
                  <div>
                    <div className="fw-semibold">{member.firstName} {member.lastName}</div>
                    <div className="text-muted small">{member.role}</div>
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <a href={`mailto:${member.email}`} className="text-decoration-none">
                    {member.email}
                  </a>
                </div>
              </td>
              <td>
                <Badge 
                  bg={member.isActive ? "success" : "secondary"} 
                  className="px-2 py-1 rounded-pill"
                >
                  {member.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              {[1, 2, 4, 3].map((statusId) => {
                const count = member.tasks.filter(task => task.statusId === statusId).length;
                return (
                  <td key={statusId} className="text-center">
                    {count > 0 ? (
                      <StatusCountBadge count={count} statusId={statusId} />
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                );
              })}
              <td>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" id="dropdown-actions" className="text-muted p-0">
                    <i className="bi bi-three-dots-vertical"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#">
                      <i className="bi bi-pencil-square me-2"></i>Edit
                    </Dropdown.Item>
                    <Dropdown.Item href="#">
                      <i className="bi bi-person-lines-fill me-2"></i>View Profile
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="#" onClick={() => toggleStatus(member.id)}>
                      <i className="bi bi-power me-2"></i>
                      {member.isActive ? "Deactivate" : "Activate"}
                    </Dropdown.Item>
                    <Dropdown.Item href="#" className="text-danger">
                      <i className="bi bi-trash me-2"></i>Remove
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const TeamMemberCardView = ({ users, toggleStatus }: { users: User[], toggleStatus: (id: string) => void }) => {
  return (
    <Row className="g-4">
      {users.map((member) => (
        <Col md={6} lg={4} key={member.id}>
          <Card className="h-100 shadow-sm border-0 hover-shadow transition-all">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <Image 
                      src={getAvatarUrl(`${member.firstName} ${member.lastName}`)} 
                      alt="avatar"
                      roundedCircle
                      width={48}
                      height={48}
                      className="border border-2 border-white shadow-sm"
                    />
                  </div>
                  <div>
                    <h5 className="mb-0">{member.firstName} {member.lastName}</h5>
                    <div className="d-flex align-items-center">
                      <Badge bg={member.isActive ? "success" : "secondary"} className="me-2">
                        {member.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-muted small">{member.role}</span>
                    </div>
                  </div>
                </div>
                <Form.Switch
                  id={`status-switch-${member.id}`}
                  checked={member.isActive}
                  onChange={() => toggleStatus(member.id)}
                  className="ms-2"
                />
              </div>
              
              <div className="mb-3">
                <a href={`mailto:${member.email}`} className="text-decoration-none small">
                  <i className="bi bi-envelope me-2"></i>
                  {member.email}
                </a>
              </div>
              
              <div className="mt-auto">
                <h6 className="mb-2 text-muted text-uppercase small">Task Status</h6>
                <div className="d-flex justify-content-between gap-2 flex-wrap">
                  {[1, 2, 4, 3].map(statusId => {
                    const filtered = member.tasks.filter(task => task.statusId === statusId);
                    const color = getStatusColor(statusLabels[statusId]);
                    return (
                      <div
                        key={statusId}
                        className="flex-grow-1 p-2 rounded-2"
                        style={{
                          backgroundColor: color + "15",
                          borderLeft: `3px solid ${color}`,
                          minWidth: "80px",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="small" style={{ color }}>{statusLabels[statusId]}</span>
                          <Badge pill bg="" style={{ backgroundColor: color }} className="px-2">
                            {filtered.length}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card.Body>
            <Card.Footer className="bg-transparent border-top-0">
              <div className="d-flex justify-content-end gap-2">
                <Button variant="outline-primary" size="sm">
                  <i className="bi bi-pencil-square me-1"></i> Edit
                </Button>
                <Button variant="outline-danger" size="sm">
                  <i className="bi bi-trash me-1"></i> Remove
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

const TeamDashboard = () => {
  const [users, setUsers] = useState<User[]>(teamMembers);
  const [view, setView] = useState<"list" | "card">("list");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const toggleStatus = (id: string) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase()) || 
                         user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || 
                         (statusFilter === "Active" && user.isActive) || 
                         (statusFilter === "Inactive" && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <Container fluid className="py-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Team Dashboard</h2>
          <p className="text-muted mb-0">Track team members and their task progress</p>
        </div>
        <div>
          <Button 
            variant={view === "list" ? "primary" : "outline-secondary"} 
            className="me-2"
            onClick={() => setView("list")}
          >
            <i className="bi bi-list me-2"></i> List View
          </Button>
          <Button 
            variant={view === "card" ? "primary" : "outline-secondary"}
            onClick={() => setView("card")}
          >
            <i className="bi bi-grid-3x3-gap me-2"></i> Card View
          </Button>
        </div>
      </div>

      <div className="mb-3">
        <div className="row g-2 mb-2">
          <div className="col-md">
            <Form.Control 
              type="text" 
              placeholder="Search by name or email" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md">
            <Form.Select onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">All Roles</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Product Manager">Product Manager</option>
            </Form.Select>
          </div>
          <div className="col-md">
            <Form.Select onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Form.Select>
          </div>
        </div>
      </div>

      {view === "list" ? (
        <TeamMemberListView users={filteredUsers} toggleStatus={toggleStatus} />
      ) : (
        <TeamMemberCardView users={filteredUsers} toggleStatus={toggleStatus} />
      )}
    </Container>
  );
};

export default TeamDashboard;