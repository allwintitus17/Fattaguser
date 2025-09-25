// components/UpiPaymentGateway.js (Simplified - Direct Payment)
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createPayment, verifyUpiPayment, resetPayment } from '../features/payment/paymentSlice';

const UpiPaymentGateway = ({ 
  isOpen, 
  onClose, 
  amount, 
  vehicleData, 
  personalData, 
  user,
  vehicleId,
  personalDetailsId 
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPayment, isLoading, isError, isSuccess, message, paymentStatus } = useSelector(
    (state) => state.payment
  );

  const [paymentStep, setPaymentStep] = useState('initiate');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');

  // Payment method options
  const paymentMethods = [
    { id: 'upi', name: 'UPI Payment', icon: '💳' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💸' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
    { id: 'wallet', name: 'Digital Wallet', icon: '📱' }
  ];

  // Handle payment creation response
  useEffect(() => {
    console.log('Payment Redux State:', { isSuccess, isError, message, currentPayment, paymentStatus });

    if (isSuccess && currentPayment && paymentStep === 'initiate') {
      console.log('Payment created successfully:', currentPayment);
      // Directly mark as success for simulation
      setPaymentStep('success');
      toast.success('Payment completed successfully!');
    }

    if (isError) {
      console.error('Payment creation error:', message);
      toast.error(message || 'Payment creation failed');
      setPaymentStep('failed');
    }
  }, [isSuccess, isError, message, currentPayment, paymentStatus, paymentStep]);

  // Initialize payment with direct completion
  const initiatePayment = () => {
    if (!vehicleId || !personalDetailsId) {
      toast.error('Vehicle and personal details must be saved first');
      return;
    }

    // Generate mock transaction ID
    const mockTransactionId = 'TXN' + Date.now() + Math.random().toString(36).substring(2, 8).toUpperCase();

    const paymentData = {
      paymentFlag: 0, // New FastTag
      amount: parseFloat(amount),
      vehicleId,
      personalDetailsId,
      paymentMethod: selectedPaymentMethod,
      transactionId: mockTransactionId,
      status: 'SUCCESS', // Directly mark as successful
      vehicleInfo: {
        registrationNumber: vehicleData.registrationNumber,
        vehicleType: vehicleData.vehicleType,
        model: vehicleData.model,
        chassisNumber: vehicleData.chassisNumber,
        engineNumber: vehicleData.engineNumber
      },
      personalInfo: {
        fullName: personalData.fullName,
        phoneNumber: user.mobile || user.phone || '0000000000',
        email: user.email,
        panNumber: personalData.panNumber,
        aadharNumber: personalData.aadharNumber
      },
      metadata: {
        deviceInfo: navigator.userAgent,
        appVersion: '1.0.0',
        source: 'web',
        paymentType: selectedPaymentMethod,
        simulatedPayment: true // Flag to indicate this is a simulated payment
      }
    };

    console.log('Creating simulated payment with data:', paymentData);
    dispatch(createPayment(paymentData));
  };

  // Handle redirect to MyTag page
  const handleContinueToMyTag = () => {
    onClose();
    navigate('/mytag'); // Navigate to MyTag.jsx
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="payment-modal" style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ×
        </button>

        {/* Payment Initiation */}
        {paymentStep === 'initiate' && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#333', marginBottom: '1rem' }}>Complete Payment</h2>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ color: '#495057', marginBottom: '1rem' }}>Payment Summary</h3>
              <div style={{ textAlign: 'left' }}>
                <p><strong>Amount:</strong> ₹{amount}</p>
                <p><strong>Vehicle:</strong> {vehicleData.registrationNumber}</p>
                <p><strong>Type:</strong> {vehicleData.vehicleType}</p>
                <p><strong>Customer:</strong> {personalData.fullName}</p>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem', color: '#495057' }}>Select Payment Method</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px',
                      border: selectedPaymentMethod === method.id ? '2px solid #007bff' : '1px solid #ddd',
                      borderRadius: '8px',
                      backgroundColor: selectedPaymentMethod === method.id ? '#e7f3ff' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{method.icon}</span>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{method.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={initiatePayment}
              disabled={isLoading}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                width: '100%'
              }}
            >
              {isLoading ? 'Processing Payment...' : `Pay ₹${amount} Now`}
            </button>
          </div>
        )}

        {/* Success */}
        {paymentStep === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '64px', 
              color: '#28a745', 
              marginBottom: '1rem',
              animation: 'bounce 0.6s ease-in-out'
            }}>
              ✅
            </div>
            <h2 style={{ color: '#28a745', marginBottom: '1rem' }}>Payment Done!</h2>
            
            <div style={{
              backgroundColor: '#d4edda',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '1px solid #c3e6cb'
            }}>
              <p><strong>Payment ID:</strong> {currentPayment?.paymentId || `PAY${Date.now()}`}</p>
              <p><strong>Amount:</strong> ₹{amount}</p>
              <p><strong>Method:</strong> {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}</p>
              <p><strong>Status:</strong> ✅ Completed</p>
            </div>

            <p style={{ marginBottom: '1.5rem', color: '#666', fontSize: '14px' }}>
              Your FastTag application has been processed successfully. 
              Redirecting to your FastTag dashboard...
            </p>

            <button
              onClick={handleContinueToMyTag}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Go to My FastTag →
            </button>
          </div>
        )}

        {/* Failed */}
        {paymentStep === 'failed' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '48px', 
              color: '#dc3545', 
              marginBottom: '1rem' 
            }}>
              ❌
            </div>
            <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>Payment Failed</h2>
            
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              {message || 'Payment could not be processed. Please try again.'}
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPaymentStep('initiate');
                  dispatch(resetPayment());
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add simple bounce animation */}
      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 60%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          80% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};

export default UpiPaymentGateway;