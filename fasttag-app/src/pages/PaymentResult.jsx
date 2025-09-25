import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CryptoJS from "crypto-js";
import { toast } from 'react-toastify';

const Wrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const ReceiptCard = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, #28a745, #20c997, #17a2b8);
  }
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #28a745, #20c997);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2.5rem;
  color: white;
  box-shadow: 0 10px 25px rgba(40, 167, 69, 0.3);

  &::before {
    content: '✓';
    animation: checkmark 0.5s ease-in-out;
  }

  @keyframes checkmark {
    0% { transform: scale(0); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
`;

const Title = styled.h2`
  font-weight: 700;
  color: #28a745;
  margin-bottom: 1rem;
  font-size: 2rem;
`;

const Subtitle = styled.p`
  color: #6c757d;
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const DetailsGrid = styled.div`
  display: grid;
  gap: 1rem;
  margin: 2rem 0;
  text-align: left;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #28a745;

  .label {
    font-weight: 600;
    color: #495057;
    font-size: 0.95rem;
  }

  .value {
    font-weight: 700;
    color: #212529;
    font-size: 1rem;
  }

  &.amount {
    background: linear-gradient(135deg, #e8f5e8, #d4edda);
    
    .value {
      color: #28a745;
      font-size: 1.25rem;
    }
  }
`;

const RedirectNotice = styled.div`
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  border: 1px solid #2196f3;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
  color: #1976d2;

  .countdown {
    font-weight: 700;
    font-size: 1.1rem;
    margin-left: 0.5rem;
  }
`;

export default function PaymentResult() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = React.useState(5);

  const encryptedData = params.get("data");
  let details = {};

  if (encryptedData) {
    try {
      const secretKey = "12345678901234567890123456789012!";
      const bytes = CryptoJS.AES.decrypt(
        decodeURIComponent(encryptedData),
        secretKey
      );
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      details = JSON.parse(decrypted);
      
      // Show success toast
      toast.success('Payment completed successfully!');
    } catch (err) {
      console.error("❌ Failed to decrypt payment data", err);
      toast.error('Error processing payment data');
    }
  }

  // Countdown effect and redirect to mytag.jsx
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Navigate to mytag.jsx after countdown
          navigate('/mytag');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <Wrapper>
      <ReceiptCard>
        <SuccessIcon />
        
        <Title>Payment Successful!</Title>
        <Subtitle>
          Your FastTag application has been processed successfully.
          <br />
          Thank you for choosing our service!
        </Subtitle>
        
        <DetailsGrid>
          <DetailItem>
            <span className="label">Transaction ID:</span>
            <span className="value">{details.txId || 'N/A'}</span>
          </DetailItem>
          
          <DetailItem>
            <span className="label">Reference:</span>
            <span className="value">{details.reference || 'N/A'}</span>
          </DetailItem>
          
          <DetailItem>
            <span className="label">Merchant:</span>
            <span className="value">{details.merchant || 'FastTag Services'}</span>
          </DetailItem>
          
          <DetailItem>
            <span className="label">Customer Name:</span>
            <span className="value">{details.name || details.userName || 'N/A'}</span>
          </DetailItem>
          
          <DetailItem>
            <span className="label">Vehicle Registration:</span>
            <span className="value">{details.registrationNumber || 'N/A'}</span>
          </DetailItem>
          
          <DetailItem>
            <span className="label">Vehicle Type:</span>
            <span className="value">{details.vehicleType || 'N/A'}</span>
          </DetailItem>
          
          <DetailItem>
            <span className="label">Account:</span>
            <span className="value">{details.accountNumber || 'N/A'}</span>
          </DetailItem>
          
          <DetailItem>
            <span className="label">IFSC:</span>
            <span className="value">{details.ifsc || 'N/A'}</span>
          </DetailItem>
          
          <DetailItem className="amount">
            <span className="label">Amount Paid:</span>
            <span className="value">₹{details.amount || '0'}</span>
          </DetailItem>
          
          <DetailItem>
            <span className="label">Status:</span>
            <span className="value" style={{ color: '#28a745', fontWeight: '700' }}>
              {details.status || 'SUCCESS'}
            </span>
          </DetailItem>
          
          <DetailItem>
            <span className="label">Timestamp:</span>
            <span className="value">{details.timestamp || new Date().toLocaleString()}</span>
          </DetailItem>
        </DetailsGrid>
        
        <RedirectNotice>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>Redirecting to your FastTag dashboard in</span>
            <span className="countdown">{countdown} seconds</span>
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: '0.8' }}>
            You can also view your FastTag details and transaction history there.
          </div>
        </RedirectNotice>
        
        {/* Manual redirect button */}
        <div style={{ marginTop: '1.5rem' }}>
          <button
            onClick={() => navigate('/mytag')}
            style={{
              background: 'linear-gradient(135deg, #28a745, #20c997)',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 5px 15px rgba(40, 167, 69, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 5px 15px rgba(40, 167, 69, 0.3)';
            }}
          >
            Go to My FastTag Now
          </button>
        </div>
      </ReceiptCard>
    </Wrapper>
  );
}