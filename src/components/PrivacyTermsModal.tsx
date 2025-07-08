import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface PrivacyTermsModalProps {
  show: boolean;
  onHide: () => void;
}

const PrivacyTermsModal: React.FC<PrivacyTermsModalProps> = ({ show, onHide }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Button 
            variant="link" 
            className={`me-2 ${activeTab === 'privacy' ? 'text-primary fw-bold' : 'text-secondary'}`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy Policy
          </Button>
          <Button 
            variant="link" 
            className={activeTab === 'terms' ? 'text-primary fw-bold' : 'text-secondary'}
            onClick={() => setActiveTab('terms')}
          >
            Terms & Conditions
          </Button>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {activeTab === 'privacy' ? (
          <div>
            <h4 className="mb-3">Privacy Policy</h4>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h5>1. Information We Collect</h5>
            <p>
              We collect personal information that you provide to us when registering for an account, 
              including your name, email address, and password. We may also collect usage data about 
              how you interact with our service.
            </p>
            
            <h5>2. How We Use Your Information</h5>
            <p>
              Your information is used to provide and improve our services, communicate with you, 
              and ensure the security of your account. We do not sell your personal information to third parties.
            </p>
            
            <h5>3. Data Security</h5>
            <p>
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, or destruction.
            </p>
            
            <h5>4. Your Rights</h5>
            <p>
              You have the right to access, correct, or delete your personal information. You may also 
              object to or restrict certain processing of your data.
            </p>
          </div>
        ) : (
          <div>
            <h4 className="mb-3">Terms & Conditions</h4>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h5>1. Acceptance of Terms</h5>
            <p>
              By creating an account, you agree to be bound by these Terms and Conditions. If you do 
              not agree, you may not use our services.
            </p>
            
            <h5>2. Account Responsibilities</h5>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and 
              for all activities that occur under your account.
            </p>
            
            <h5>3. Prohibited Activities</h5>
            <p>
              You may not use our service for any illegal or unauthorized purpose, including violating 
              intellectual property rights or distributing malicious software.
            </p>
            
            <h5>4. Service Modifications</h5>
            <p>
              We reserve the right to modify or discontinue the service at any time without notice. 
              We are not liable for any modification, suspension, or discontinuance of the service.
            </p>
            
            <h5>5. Limitation of Liability</h5>
            <p>
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages resulting from your use of the service.
            </p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          I Understand
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PrivacyTermsModal;