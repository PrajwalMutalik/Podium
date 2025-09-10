const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

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
    // Verify environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing email configuration');
      return res.status(500).json({ msg: 'Server configuration error. Please try again later.' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter
    await transporter.verify();

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
    console.error('Contact form error:', err);
    
    // Send appropriate error messages
    if (err.code === 'EAUTH') {
      return res.status(500).json({ msg: 'Email authentication failed. Please try again later.' });
    } else if (err.code === 'ETIMEDOUT') {
      return res.status(500).json({ msg: 'Request timed out. Please try again.' });
    }
    
    res.status(500).json({ msg: 'Failed to send message. Please try again later.' });
  }
});

module.exports = router;
