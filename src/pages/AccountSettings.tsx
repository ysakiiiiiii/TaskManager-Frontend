import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav, Form, Button, Image, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('account');

  const [formData, setFormData] = useState({
    firstName: 'Lucky',
    lastName: 'Acidera',
    email: 'lucky@tasky.com',
  });

  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const isPasswordValid = passwords.newPassword.length >= 8 &&
    /[A-Z]/.test(passwords.newPassword) &&
    /[\W_]/.test(passwords.newPassword);

  return (
    <Container fluid className="" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <Row className="justify-content-center">
        {/* Profile Card - Modernized */}
        <Col md={4} className="mb-4">
          <Card className="border-0 shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100px', 
              background: 'linear-gradient(135deg, #6a6dfb 0%, #ee534f 100%)' 
            }}></div>
            <Card.Body className="text-center pt-0">
              <div style={{ marginTop: '-50px' }}>
                <Image
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  roundedCircle
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    border: '4px solid white',
                    objectFit: 'cover'
                  }}
                  className="shadow"
                />
              </div>
              <h4 className="mt-3 mb-1" style={{ fontWeight: '600' }}>{formData.firstName} {formData.lastName}</h4>
              <span className="text-muted d-block mb-3">User</span>
              
              <div className="d-flex justify-content-around mt-4 text-center">
                <div>
                  <h5 style={{ color: '#6a6dfb', fontWeight: '700' }}>1.23k</h5>
                  <small className="text-muted">Task Done</small>
                </div>
                <div>
                  <h5 style={{ color: '#ee534f', fontWeight: '700' }}>568</h5>
                  <small className="text-muted">Project Done</small>
                </div>
              </div>
              
              <hr className="my-4" />
              
              <div className="text-start px-3">
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-envelope me-2" style={{ color: '#6a6dfb' }}></i>
                  <span>{formData.email}</span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-check-circle me-2" style={{ color: '#6a6dfb' }}></i>
                  <span>Active</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="bi bi-person-badge me-2" style={{ color: '#6a6dfb' }}></i>
                  <span>Author</span>
                </div>
              </div>
              
              <div className="d-flex justify-content-between mt-4">
                <Button 
                  variant="outline-danger"
                  size="sm"
                  className="text-danger border-danger rounded px-4 py-2"
                  style={{ transition: 'all 0.2s ease-in-out' }}
                  onMouseEnter={(e) => e.currentTarget.classList.add('bg-danger', 'text-white')}
                  onMouseLeave={(e) => e.currentTarget.classList.remove('bg-danger', 'text-white')}
                  >
                  Suspend
                  </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Settings Form - Modernized */}
        <Col md={8}>
          <Card className="border-0 shadow-lg" style={{ borderRadius: '15px' }}>
            <Card.Header className="border-0 bg-white">
              <Nav variant="pills" activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'account')}>
                <Nav.Item>
                  <Nav.Link 
                    eventKey="account" 
                    style={{ 
                      color: activeTab === 'account' ? 'white' : '#6a6dfb',
                      backgroundColor: activeTab === 'account' ? '#6a6dfb' : 'transparent',
                      borderRadius: '8px',
                      marginRight: '8px'
                    }}
                  >
                    Account
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    eventKey="privacy" 
                    style={{ 
                      color: activeTab === 'privacy' ? 'white' : '#6a6dfb',
                      backgroundColor: activeTab === 'privacy' ? '#6a6dfb' : 'transparent',
                      borderRadius: '8px'
                    }}
                  >
                    Privacy
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              {activeTab === 'account' && (
                <Form>
                  <h5 className="mb-4" style={{ color: '#6a6dfb', fontWeight: '600' }}>Profile Information</h5>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      style={{ borderRadius: '8px', padding: '0.75rem 1rem' }}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      style={{ borderRadius: '8px', padding: '0.75rem 1rem' }}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      style={{ borderRadius: '8px', padding: '0.75rem 1rem' }}
                    />
                  </Form.Group>
                  
                  <Button 
                    variant="primary" 
                    style={{ 
                      backgroundColor: '#6a6dfb', 
                      borderColor: '#6a6dfb',
                      borderRadius: '8px',
                      padding: '0.5rem 2rem',
                      fontWeight: '500'
                    }}
                  >
                    Save Changes
                  </Button>
                </Form>
              )}

              {activeTab === 'privacy' && (
                <Form>
                  <h5 className="mb-4" style={{ color: '#6a6dfb', fontWeight: '600' }}>Password Settings</h5>
                  
                  <Alert variant="warning" style={{ borderRadius: '8px', borderLeft: '4px solid #ee534f' }}>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-exclamation-triangle-fill me-2" style={{ color: '#ee534f' }}></i>
                      <strong>Password Requirements</strong>
                    </div>
                    <ul className="mt-2 mb-0">
                      <li>Minimum 8 characters long</li>
                      <li>At least one uppercase letter</li>
                      <li>At least one special character</li>
                    </ul>
                  </Alert>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      style={{ borderRadius: '8px', padding: '0.75rem 1rem' }}
                    />
                    {passwords.newPassword && !isPasswordValid && (
                      <small className="text-danger">Password doesn't meet requirements</small>
                    )}
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      style={{ borderRadius: '8px', padding: '0.75rem 1rem' }}
                    />
                    {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
                      <small className="text-danger">Passwords don't match</small>
                    )}
                  </Form.Group>
                  
                  <Button 
                    variant="primary" 
                    disabled={!isPasswordValid || passwords.newPassword !== passwords.confirmPassword}
                    style={{ 
                      backgroundColor: '#6a6dfb', 
                      borderColor: '#6a6dfb',
                      borderRadius: '8px',
                      padding: '0.5rem 2rem',
                      fontWeight: '500'
                    }}
                  >
                    Change Password
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountSettings;