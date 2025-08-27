import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpgradePage = () => {
  const [transactionId, setTransactionId] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5001/api/payment/verify', 
        { transactionId },
        { headers: { 'x-auth-token': token } }
      );
      setMessage(res.data.msg);
      setTimeout(() => navigate('/dashboard'), 2000); // Redirect after 2s
    } catch (error) {
      setMessage(error.response.data.msg || 'Verification failed.');
    }
  };

  return (
    <div className="glass-container">
      <h1>Upgrade Your Account</h1>
      <p>You have reached your daily limit of 5 free practice sessions.</p>
      <p>Scan the QR code below to pay and get **20 additional requests**.</p>
      
      <div className="qr-code-container">
        {/* REPLACE THIS with the actual URL to your QR code image */}
        <img src="https://i.imgur.com/your-qr-code.png" alt="Payment QR Code" style={{width: '200px', height: '200px', borderRadius: '8px'}} />
      </div>

      <form onSubmit={handleVerify}>
        <div className="form-group">
          <label htmlFor="transactionId">Enter Transaction ID:</label>
          <input
            type="text"
            id="transactionId"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Paste the ID from your payment app"
            required
          />
        </div>
        <button type="submit">Verify Payment</button>
      </form>
      {message && <p style={{marginTop: '1rem'}}>{message}</p>}
    </div>
  );
};

export default UpgradePage;
