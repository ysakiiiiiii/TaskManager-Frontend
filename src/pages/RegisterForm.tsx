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
import { User, Mail, Lock, Shield, Eye, EyeOff } from "react-feather";
import { Link } from "react-router-dom";
import PrivacyTermsModal from "../components/PrivacyTermsModal";
import "../styles/RegisterForm.css";
import { registerUser } from "../services/authService";
import { type RegisterFormState } from "../interfaces/auth";

const RegisterForm: React.FC = () => {
  const [form, setForm] = useState<RegisterFormState>({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [error, setError] = useState<string[] | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.password !== form.confirmPassword) {
      setError(["Passwords do not match"]);
      return;
    }

    if (!form.agree) {
      setError(["You must agree to the privacy policy and terms."]);
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        password: form.password,
      });

      if (response.status === 400 && response.data?.errors) {
        const registerErrors = Object.values(
          response.data.errors
        ).flat() as string[];
        setError(registerErrors);
      } else if (response.data.success) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } else {
        setError(["Registration failed"]);
      }
    } catch (err) {
      setError(["An unexpected error occurred."]);
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
              <h3 className="fw-bold mb-3">Adventure starts here</h3>
              <p className="text-muted">
                Make your task management easy and fun!
              </p>
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
                    controlId="firstName"
                    label="First Name"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      className="form-control-sm border-2 rounded-3"
                      style={{
                        height: "calc(3.5rem + 2px)",
                        paddingTop: "1.625rem",
                      }}
                    />
                    <User className="input-icon" size={18} />
                  </FloatingLabel>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <FloatingLabel
                    controlId="lastName"
                    label="Last Name"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      className="form-control-sm border-2 rounded-3"
                      style={{
                        height: "calc(3.5rem + 2px)",
                        paddingTop: "1.625rem",
                      }}
                    />
                    <User className="input-icon" size={18} />
                  </FloatingLabel>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
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
                      placeholder=""
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
                  transition={{ delay: 0.45 }}
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
                  transition={{ delay: 0.5 }}
                >
                  <FloatingLabel
                    controlId="confirmPassword"
                    label="Confirm Password"
                    className="mb-3"
                  >
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      className="form-control-sm border-2 rounded-3 pe-4"
                      style={{
                        height: "calc(3.5rem + 2px)",
                        paddingTop: "1.625rem",
                      }}
                    />
                    <Button
                      variant="link"
                      className="position-absolute top-50 end-0 translate-middle-y me-2 pe-2 text-muted"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      tabIndex={-1}
                      type="button"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </Button>
                  </FloatingLabel>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="mb-3"
                >
                  <Form.Check
                    type="checkbox"
                    id="agree"
                    className="d-flex align-items-center"
                  >
                    <Form.Check.Input
                      type="checkbox"
                      name="agree"
                      checked={form.agree}
                      onChange={handleChange}
                      className="me-2 mt-0"
                    />
                    <Form.Check.Label>
                      I agree to{" "}
                      <Button
                        variant="link"
                        className="text-decoration-none p-0"
                        onClick={() => setShowModal(true)}
                        style={{ color: "#6a6dfb" }}
                      >
                        privacy policy & terms
                      </Button>
                    </Form.Check.Label>
                  </Form.Check>
                  <PrivacyTermsModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
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
                      "Sign Up"
                    )}
                  </Button>
                </motion.div>
              </Stack>
            </Form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="mt-4 pt-3 text-center border-top"
            >
              <Stack
                direction="horizontal"
                gap={1}
                className="justify-content-center"
              >
                <span className="text-muted">Already have an account?</span>
                <Link to="/login" className="text-decoration-none fw-bold">
                  Sign in instead
                </Link>
              </Stack>
            </motion.div>
          </Card.Body>
        </Card>
      </Container>
    </motion.div>
  );
};

export default RegisterForm;
