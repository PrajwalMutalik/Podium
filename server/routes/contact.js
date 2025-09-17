const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create reusable transporter
let transporter = null;

const initializeTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email configuration missing');
    return false;
  }
  
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  return true;
};

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  // Input validation
  if (!name || name.length < 2) {
    return res.status(400).json({ msg: 'Please enter a valid name (at least 2 characters).' });
  }

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ msg: 'Please enter a valid email address.' });
  }

  if (!message || message.length < 10) {
    return res.status(400).json({ msg: 'Please enter a message (at least 10 characters).' });
  }

  try {
    console.log('Starting contact form submission process...');

    // Initialize email transporter if not already initialized
    if (!transporter && !initializeTransporter()) {
      console.error('Failed to initialize email transporter');
      return res.status(500).json({ 
        msg: 'Email service not configured properly',
        detail: 'Missing email configuration'
      });
    }

    console.log('Verifying email transporter...');
    try {
      await transporter.verify();
      console.log('Email transporter verified successfully');
    } catch (verifyError) {
      console.error('Transporter verification failed:', verifyError);
      return res.status(500).json({ 
        msg: 'Email service verification failed',
        detail: verifyError.message
      });
    }

    // Verify transporter
    try {
      await transporter.verify();
      console.log('Email transporter verified successfully');
    } catch (verifyError) {
      console.error('Transporter verification failed:', verifyError);
      throw new Error('Email service configuration error');
    }

    const mailOptions = {
      from: `Podium App <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">New Message from Podium Contact Form</h2>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    
    // Send confirmation email to the user
    const confirmationMailOptions = {
      from: `Podium App <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'We received your message - Podium',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Thank you for contacting us!</h2>
          <p>Hello ${name},</p>
          <p>We've received your message and will get back to you as soon as possible.</p>
          <p>Best regards,<br>The Podium Team</p>
        </div>
      `,
    };

    await transporter.sendMail(confirmationMailOptions);

    res.status(200).json({ msg: 'Message sent successfully! Check your email for confirmation.' });
  } catch (err) {
    console.error('Contact form detailed error:', {
      name: err.name,
      message: err.message,
      code: err.code,
      command: err.command,
      stack: err.stack
    });
    
    // Send appropriate error messages
    if (err.code === 'EAUTH') {
      return res.status(500).json({ 
        msg: 'Email authentication failed. Please check the email configuration.',
        detail: err.message 
      });
    } else if (err.code === 'ETIMEDOUT') {
      return res.status(500).json({ 
        msg: 'Request timed out. Please try again.',
        detail: err.message 
      });
    } else if (err.code === 'ESOCKET') {
      return res.status(500).json({ 
        msg: 'Network connection error. Please check your internet connection.',
        detail: err.message 
      });
    }
    
    res.status(500).json({ 
      msg: 'Failed to send message. Please try again later.',
      detail: err.message
    });
  }
});

module.exports = router;
