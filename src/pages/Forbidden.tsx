import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ErrorPages.css';

const Forbidden = () => {
  const navigate = useNavigate();
  
  return (
    <div className="error-page min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <div className="error-content bg-white p-5 rounded-4 shadow-sm">
              <h1 className="display-1 fw-bold mb-4" style={{ color: '#6a6dfb' }}>
                403
              </h1>
              <h2 className="mb-3">Access Forbidden</h2>
              <p className="lead text-muted mb-4">
                You don't have permission to access this resource. Please contact the administrator if you believe this is an error.
              </p>
              
              <button 
                onClick={() => navigate('/')}
                className="btn btn-primary px-4 py-2 rounded-pill"
                style={{ backgroundColor: '#6a6dfb', borderColor: '#6a6dfb' }}
              >
                Go back to home
              </button>
              
              <div className="mt-5">
                <div className="d-flex justify-content-center gap-4">
                  {[1, 2, 3].map((item) => (
                    <div 
                      key={item}
                      className="error-dot" 
                      style={{ 
                        backgroundColor: `rgba(106, 109, 251, ${0.2 + (item * 0.2)})`,
                        animationDelay: `${item * 0.2}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;