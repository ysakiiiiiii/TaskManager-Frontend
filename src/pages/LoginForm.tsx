// src/components/LoginForm.tsx
import React, { useState } from "react";
import api from "../api/api";
import {
  Form,
  Button,
  Alert,
  Container,
  Card,
  FloatingLabel,
  Spinner,
  Stack,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { Mail, EyeOff, Eye } from "react-feather";
import { Link } from "react-router-dom";
import "../styles/LoginForm.css";
import type { LoginDto, LoginResponse } from "../interfaces/auth";

const LoginForm: React.FC = () => {
  const [form, setForm] = useState<LoginDto>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string[] | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await api.post<LoginResponse>("/User/Login", form);

      if (response.data.success) {
        setSuccess("Login successful! Redirecting...");
        localStorage.setItem("authToken", response.data.token || "");
        setTimeout(() => (window.location.href = "/dashboard"), 1500);
      } else {
        const errors = response.data.errors ?? [
          response.data.message ?? "Login failed",
        ];
        setError(errors);
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors);
      } else {
        setError(["Server error occurred"]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 px-3">
        <Card
          className="shadow-lg border-0 rounded-4 overflow-hidden"
          style={{ width: "100%", maxWidth: 500 }}
        >
          <div className="gradient-bg" style={{ height: "8px" }}></div>
          <Card.Body className="p-4 p-md-5">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-4"
            >
              <h3 className="fw-bold mb-3">Welcome back</h3>
              <p className="text-muted">Sign in to access your account</p>
            </motion.div>

            {error && (
              <Alert variant="danger" className="border-0 rounded-3 small">
                <ul className="mb-0 ps-3">
                  {error.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </Alert>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Alert variant="success" className="border-0 rounded-3">
                  {success}
                </Alert>
              </motion.div>
            )}

            <Form onSubmit={handleSubmit}>
              <Stack gap={1}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <FloatingLabel
                    controlId="username"
                    label="Email"
                    className="mb-3"
                  >
                    <Form.Control
                      type="email"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      className="form-control-sm border-2 rounded-3"
                      style={{
                        height: "calc(3.5rem + 2px)",
                        paddingTop: "1.625rem",
                      }}
                    />
                    <Mail className="input-icon" size={18} />
                  </FloatingLabel>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <FloatingLabel
                    controlId="password"
                    label="Password"
                    className="mb-3"
                  >
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      className="form-control-sm border-2 rounded-3 pe-5"
                      style={{
                        height: "calc(3.5rem + 2px)",
                        paddingTop: "1.625rem",
                      }}
                    />
                    <Button
                      variant="link"
                      className="position-absolute top-50 end-0 translate-middle-y me-2 pe-2 text-muted"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      type="button"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </FloatingLabel>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    type="submit"
                    className="w-100 rounded-3 py-3 fw-bold"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </motion.div>
              </Stack>
            </Form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-3"
            >
              <Link to="/" className="text-decoration-none">
                Forgot password?
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="mt-4 pt-3 text-center border-top"
            >
              <Stack
                direction="horizontal"
                gap={1}
                className="justify-content-center"
              >
                <span className="text-muted">Don't have an account?</span>
                <Link to="/register" className="text-decoration-none fw-bold">
                  Sign up
                </Link>
              </Stack>
            </motion.div>
          </Card.Body>
        </Card>
      </Container>
    </motion.div>
  );
};

export default LoginForm;
