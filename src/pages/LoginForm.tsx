// src/components/LoginForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Container, Card, Spinner } from 'react-bootstrap';



interface LoginFormState {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [form, setForm] = useState<LoginFormState>({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await axios.post('https://localhost:7179/api/User/Login', form);

      if (response.data.success) {
        setSuccess('Login successful!');
        // TODO: Store token if needed
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(', '));
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Server error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="shadow-sm p-4" style={{ width: '100%', maxWidth: 450 }}>
        <Card.Body>
          <div className="text-center mb-4">
            <h3 className="fw-bold">Welcome back 👋</h3>
            <p className="text-muted">Please sign-in to your account</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email or Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </Form.Group>

            <Button type="submit" className="w-100" variant="primary" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Sign in'}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <span>New on our platform?</span>{' '}
            <a href="/register">Create an account</a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginForm;
