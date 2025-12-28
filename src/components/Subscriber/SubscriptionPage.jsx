import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscriptionsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SubscriptionPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const { user, isCreator } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isCreator) {
      navigate('/creator/dashboard');
      return;
    }

    fetchSubscriptionStatus();
  }, [user, isCreator, navigate]);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await subscriptionsAPI.getSubscriptionStatus();
      setSubscriptionStatus(response.data);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    }
  };

  const handleMockPayment = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await subscriptionsAPI.mockPayment();
      setSuccess(response.data.message);
      
      setTimeout(() => {
        fetchSubscriptionStatus();
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || 'Payment failed');
      setLoading(false);
    }
  };

  if (!user || isCreator) {
    return null;
  }

  return (
    <div className="container-small">
      <div className="card">
        <h2 className="card-header">Subscription</h2>

        {subscriptionStatus?.is_paid_subscriber ? (
          <div>
            <div className="alert alert-success">
              You are currently subscribed! You have access to all premium content.
            </div>
            <div className="form-group">
              <label className="form-label">Subscription Status</label>
              <p style={{ color: '#27ae60', fontWeight: 'bold' }}>Active</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="alert alert-info">
              Subscribe to access all premium content from our creators.
            </div>

            <div className="form-group">
              <h3 style={{ marginBottom: '1rem' }}>Premium Subscription</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>
                $9.99/month
              </p>
              <ul style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
                <li>Access to all premium articles</li>
                <li>Exclusive content from creators</li>
                <li>Ad-free reading experience</li>
                <li>Support independent creators</li>
              </ul>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}

            <button
              onClick={handleMockPayment}
              className="btn btn-success btn-block"
              disabled={loading}
              style={{ marginBottom: '1rem' }}
            >
              {loading ? 'Processing...' : 'Subscribe Now (Test Mode)'}
            </button>

            <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <p style={{ fontSize: '0.875rem', color: '#7f8c8d', margin: 0 }}>
                <strong>Note:</strong> This is a test mode payment. No real charges will be made.
                Click the button above to simulate a successful payment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;