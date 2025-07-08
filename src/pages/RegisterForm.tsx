// src/components/RegisterForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';

interface RegisterFormState {
  firstName: string;
  lastName: string;
  username: string; // used as email in backend
  password: string;
  agree: boolean;
}

const RegisterForm: React.FC = () => {
  const [form, setForm] = useState<RegisterFormState>({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    agree: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.agree) {
      setError('You must agree to the privacy policy and terms.');
      return;
    }

    try {
      const response = await axios.post('https://localhost:7179/api/User/Register', {
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username, // backend expects this as email
        password: form.password,
      });

      if (response.data.success) {
        setSuccess('Registered successfully! You can now login.');
        setForm({
          firstName: '',
          lastName: '',
          username: '',
          password: '',
          agree: false,
        });
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err: any) {
      console.error('Registration error:', err.response);

      const apiError = err.response?.data;
      if (Array.isArray(apiError?.errors)) {
        setError(apiError.errors.join(', '));
      } else {
        setError(apiError?.message || 'An unexpected error occurred.');
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-sm" style={{ maxWidth: '500px', width: '100%' }}>
        <Card.Body>
          <div className="text-center mb-4">
            <h3>Adventure starts here 🚀</h3>
            <p className="text-muted">Make your app management easy and fun!</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="username"
                placeholder="Enter your email"
                value={form.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="I agree to privacy policy & terms"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Sign up
            </Button>
          </Form>

          <div className="text-center mt-3">
            <span>Already have an account? </span>
            <a href="/login">Sign in instead</a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterForm;
